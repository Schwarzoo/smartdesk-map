import { INCREMENTO_MEZZ_ORA, ORA_MASSIMA, DURATA_MINIMA } from "../constants/config";

// =====================
// 🕒 UTILITÀ GESTIONE ORARI E SLOT
// =====================

/**
 * Genera gli orari disponibili per l'inizio della prenotazione
 * Se è "oggi", parte dall'ora corrente; se è "domani", parte da mezzanotte
 * @param {string} giorno - "oggi" o "domani"
 * @returns {Array} Array di oggetti {valore, label} con gli orari disponibili
 */
export function generaOrariInizio(giorno) {
  const orari = [];
  const adesso = new Date();
  const oraCorrente = adesso.getHours() + adesso.getMinutes() / 60;
  
  // Se è oggi, parti dall'ora corrente arrotondata alla mezz'ora successiva
  // default: se oggi, per debug permettiamo la selezione di orari passati
  // Nota: questa modifica abilita sempre la selezione di orari passati per 'oggi'.
  // Se preferisci usare una variabile di ambiente, ripristina la logica precedente.
  let oraPartenza = 0;
  if (giorno === "oggi") {
    // partenza 0 -> mostra tutta la giornata incluse ore passate
    oraPartenza = 0;
  }
  
  for (let ora = Math.max(0, Math.floor(oraPartenza)); ora < ORA_MASSIMA; ora++) {
    const mezz = [0, INCREMENTO_MEZZ_ORA];
    mezz.forEach(function(m) {
      const oraTotale = ora + m;
      if (oraTotale >= oraPartenza && oraTotale < ORA_MASSIMA) {
        const minuti = m === INCREMENTO_MEZZ_ORA ? "30" : "00";
        const oraFormattata = Math.floor(oraTotale % ORA_MASSIMA).toString().padStart(2, '0');
        orari.push({ valore: oraTotale, label: `${oraFormattata}:${minuti}` });
      }
    });
  }
  return orari;
}

/**
 * Genera gli orari disponibili per la fine della prenotazione
 * Minimo 1 ora dopo l'inizio, massimo fino alle 6:00 del giorno dopo (30 ore totali)
 * @param {number} oraInizio - Ora di inizio in formato decimale
 * @param {string} giorno - "oggi" o "domani" (attualmente non usato ma disponibile)
 * @returns {Array} Array di oggetti {valore, label} con gli orari disponibili
 */
export function generaOrariFine(oraInizio, giorno) {
  if (!oraInizio && oraInizio !== 0) return [];
  
  const orari = [];
  const oraMinima = oraInizio + DURATA_MINIMA; // Minimo 1 ora dopo
  const oraMassima = 30; // Fino alle 6:00 del giorno dopo (permette prenotazioni notturne)
  
  let oraCorrente = oraMinima;
  while (oraCorrente <= oraMassima) {
    const ora = Math.floor(oraCorrente) % ORA_MASSIMA;
    const minuti = (oraCorrente % 1) === INCREMENTO_MEZZ_ORA ? "30" : "00";
    
    // Formatta correttamente l'ora (0-23)
    const oraFormattata = ora.toString().padStart(2, '0');
    const minutiFormattati = minuti.padStart(2, '0');
    
    orari.push({ 
      valore: oraCorrente, 
      label: `${oraFormattata}:${minutiFormattati}` 
    });
    oraCorrente += INCREMENTO_MEZZ_ORA; // Incremento di 30 minuti
  }
  
  return orari;
}
