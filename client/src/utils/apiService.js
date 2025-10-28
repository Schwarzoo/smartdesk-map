import { API_BASE } from "../constants/config";
import { dataUTCLocale, oraAData } from "./dateUtils";
import { NOMI_CASUALI } from "../constants/mockData";
import { DURATA_LIBERAZIONE_TEMPORANEA } from "../constants/config";

// =====================
// 📡 SERVIZIO API - GESTIONE CHIAMATE AL BACKEND
// =====================

/**
 * Recupera tutti i tavoli dal server
 * @returns {Promise<Array>} Array di tavoli
 */
export async function fetchTavoli() {
  try {
    const res = await fetch(`${API_BASE}/tables`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Errore caricamento tavoli:", e);
    throw e;
  }
}


export async function prenotaTavolo(tavoloId, username, dataInizio, dataFine) {
  try {
    const res = await fetch(`${API_BASE}/tables/${tavoloId}/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        start: dataInizio.toISOString(),
        end: dataFine.toISOString(),
      }),
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Errore durante la prenotazione");
    }
    
    return await res.json();
  } catch (e) {
    console.error("Errore prenotazione:", e);
    throw e;
  }
}

/**
 * Libera un tavolo cancellando tutte le sue prenotazioni
 * @param {string} tavoloId - ID del tavolo da liberare
 * @returns {Promise<Object>} Risposta del server
 */
export async function liberaTavolo(tavoloId) {
  try {
    const res = await fetch(`${API_BASE}/tables/${tavoloId}/release`, { 
      method: "POST" 
    });
    return await res.json();
  } catch (e) {
    console.error("Errore liberazione tavolo:", e);
    throw e;
  }
}

/**
 * Cancella tutte le prenotazioni di tutti i tavoli
 * @param {Array} tavoli - Array di tutti i tavoli
 * @returns {Promise<void>}
 */
export async function cancellaPrenotazioni(tavoli) {
  try {
    for (const tavolo of tavoli) {
      await liberaTavolo(tavolo.id);
    }
  } catch (e) {
    console.error("Errore cancellazione prenotazioni:", e);
    throw e;
  }
}

/**
 * Cancella le prenotazioni passate (terminate) mantenendo quelle future
 * @param {Array} tavoli - Array di tutti i tavoli
 * @returns {Promise<void>}
 */
export async function cancellaPrenotazioniPassate(tavoli) {
  try {
    const adesso = new Date();
    
    for (const tavolo of tavoli) {
      if (!tavolo.reservations || tavolo.reservations.length === 0) continue;
      
      // Trova prenotazioni terminate
      const prenotazioniPassate = tavolo.reservations.filter(function(r) {
        const fine = dataUTCLocale(r.end);
        return fine < adesso;
      });
      
      // Se ci sono prenotazioni passate, libera il tavolo e ricrea solo quelle future
      if (prenotazioniPassate.length > 0) {
        const prenotazioniFuture = tavolo.reservations.filter(function(r) {
          const fine = dataUTCLocale(r.end);
          return fine >= adesso;
        });
        
        // Libera il tavolo
        await liberaTavolo(tavolo.id);
        
        // Ricrea solo le prenotazioni future
        for (const prenotazione of prenotazioniFuture) {
          await prenotaTavolo(
            tavolo.id,
            prenotazione.username,
            new Date(prenotazione.start),
            new Date(prenotazione.end)
          );
        }
      }
    }
  } catch (e) {
    console.error("Errore cancellazione prenotazioni passate:", e);
    throw e;
  }
}

/**
 * Libera temporaneamente un tavolo per 1 ora (sposta l'inizio della prenotazione)
 * @param {string} username - Nome utente che vuole liberare il tavolo
 * @param {Array} tavoli - Array di tutti i tavoli
 * @returns {Promise<Object>} Oggetto con risultato: {success, message, tavolo}
 */
export async function liberaTavoloTemporaneo(username, tavoli) {
  if (!username.trim()) {
    throw new Error("Inserisci il tuo nome utente");
  }

  const adesso = new Date();
  
  // Cerca la prenotazione attiva dell'utente
  let prenotazioneTrovata = null;
  let tavoloTrovato = null;

  for (const tavolo of tavoli) {
    if (tavolo.reservations && tavolo.reservations.length > 0) {
      const prenotazione = tavolo.reservations.find(function(r) {
        const inizio = dataUTCLocale(r.start);
        const fine = dataUTCLocale(r.end);
        return r.username === username && inizio <= adesso && adesso < fine;
      });
      
      if (prenotazione) {
        prenotazioneTrovata = prenotazione;
        tavoloTrovato = tavolo;
        break;
      }
    }
  }

  if (!prenotazioneTrovata) {
    throw new Error(`Nessuna prenotazione attiva trovata per l'utente "${username}"`);
  }

  try {
    // Libera il tavolo (cancella tutte le prenotazioni)
    await liberaTavolo(tavoloTrovato.id);

    // Salva tutte le altre prenotazioni (non dell'utente corrente)
    const altrePrenotazioni = tavoloTrovato.reservations.filter(function(r) {
      return r.username !== username || 
        !(dataUTCLocale(r.start) <= adesso && adesso < dataUTCLocale(r.end));
    });

    // Ricrea le altre prenotazioni
    for (const prenotazione of altrePrenotazioni) {
      await prenotaTavolo(
        tavoloTrovato.id,
        prenotazione.username,
        new Date(prenotazione.start),
        new Date(prenotazione.end)
      );
    }

    // Calcola nuovo inizio (ora attuale + 1 ora)
    const nuovoInizio = new Date(adesso.getTime() + DURATA_LIBERAZIONE_TEMPORANEA);
    const fineOriginale = dataUTCLocale(prenotazioneTrovata.end);

    // Verifica che il nuovo inizio sia prima della fine originale
    if (nuovoInizio >= fineOriginale) {
      return {
        success: true,
        message: `Prenotazione terminata! Il tavolo ${tavoloTrovato.id} è ora libero.`,
        tavolo: tavoloTrovato
      };
    }

    // Converti il nuovo inizio in UTC correttamente
    const nuovoInizioUTC = new Date(Date.UTC(
      nuovoInizio.getFullYear(),
      nuovoInizio.getMonth(),
      nuovoInizio.getDate(),
      nuovoInizio.getHours(),
      nuovoInizio.getMinutes(),
      0,
      0
    ));

    // Ricrea la prenotazione con il nuovo inizio (spostato di 1 ora avanti)
    await prenotaTavolo(
      tavoloTrovato.id,
      prenotazioneTrovata.username,
      nuovoInizioUTC,
      new Date(prenotazioneTrovata.end)
    );

    return {
      success: true,
      message: `Tavolo liberato! Il tavolo ${tavoloTrovato.id} sarà nuovamente occupato tra 1 ora.`,
      tavolo: tavoloTrovato
    };
  } catch (e) {
    console.error("Errore liberazione temporanea:", e);
    throw new Error("Errore durante la liberazione del tavolo");
  }
}


export async function creaPrenotazioniCasuali(tavoli) {
  if (!tavoli || tavoli.length === 0) {
    throw new Error("Nessun tavolo disponibile!");
  }

  const numPrenotazioni = Math.floor(Math.random() * 10) + 5; 

  try {
    for (let i = 0; i < numPrenotazioni; i++) {
      // Seleziona un tavolo casuale
      const tavoloCasuale = tavoli[Math.floor(Math.random() * tavoli.length)];
      
      // Scegli casualmente se prenotare per oggi o domani
      const giornoCasuale = Math.random() < 0.5 ? "oggi" : "domani";
      
      // Genera orario casuale
      const adesso = new Date();
      const oraAttuale = adesso.getHours();
      
      let oraMinima, oraMassima;
      if (giornoCasuale === "oggi") {
        // Per oggi: dall'ora attuale + 1 fino alle 19
        oraMinima = Math.max(oraAttuale + 1, 8);
        oraMassima = 19;
        if (oraMinima >= oraMassima) continue; // Salta se è troppo tardi
      } else {
        // Per domani: dall'apertura (8:00) fino alle 19
        oraMinima = 8;
        oraMassima = 19;
      }
      
      const oraInizio = Math.floor(Math.random() * (oraMassima - oraMinima)) + oraMinima;
      const durata = Math.floor(Math.random() * 4) + 2; // 2-5 ore
      const oraFine = Math.min(oraInizio + durata, 21); // Max 21:00

      const dataInizio = oraAData(oraInizio, giornoCasuale);
      const dataFine = oraAData(oraFine, giornoCasuale);

      // Nome casuale
      const nomeCasuale = NOMI_CASUALI[Math.floor(Math.random() * NOMI_CASUALI.length)];

      await prenotaTavolo(tavoloCasuale.id, nomeCasuale, dataInizio, dataFine);
    }
    
    return numPrenotazioni;
  } catch (e) {
    console.error("Errore creazione prenotazioni casuali:", e);
    throw new Error("Errore durante la creazione delle prenotazioni casuali");
  }
}
