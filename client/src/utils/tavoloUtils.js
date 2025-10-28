import { dataUTCLocale } from "./dateUtils";
import { SOGLIA_PRENOTAZIONE_IMMINENTE } from "../constants/config";

// =====================
// 🪑 UTILITÀ STATO E COLORE TAVOLI
// =====================

export function isReservedNow(tavolo) {
  if (!tavolo.reservations || tavolo.reservations.length === 0) return false;
  const adesso = new Date();
  return tavolo.reservations.some(function(r) {
    const start = dataUTCLocale(r.start);
    const end = dataUTCLocale(r.end);
    return start <= adesso && adesso < end;
  });
}


export function isSlotOccupato(tavolo, slotInizio, slotFine) {
  if (!tavolo.reservations || tavolo.reservations.length === 0) return false;
  
  return tavolo.reservations.some(function(r) {
    const rInizio = dataUTCLocale(r.start);
    const rFine = dataUTCLocale(r.end);
    
    // Verifica se c'è sovrapposizione
    return (slotInizio < rFine && slotFine > rInizio);
  });
}


export function getClasseTavolo(tavolo) {
  if (!tavolo.reservations || tavolo.reservations.length === 0) {
    return "libero";
  }

  const adesso = new Date();//crea data attuale
  const traUnOra = new Date(adesso.getTime() + SOGLIA_PRENOTAZIONE_IMMINENTE);//crea data tra un ora

  // Verifica se c'è una prenotazione in corso
  const prenotazioneInCorso = tavolo.reservations.some(function(r) { //controlla se almeno un elemento
    const start = dataUTCLocale(r.start);//r è la prenotazione corrente
    const end = dataUTCLocale(r.end);
    
    // Controlla se ADESSO è tra inizio e fine
   // Prenotazione non ancora finita?

    return start <= adesso && adesso < end; // Entrambe vere = prenotazione attiva
  });

  if (prenotazioneInCorso) {
    return "occupato"; // Rosso - occupato ora
  }

  // Verifica se c'è una prenotazione entro la prossima ora
  const prenotazioneImminente = tavolo.reservations.some(function(r) {
    const start = dataUTCLocale(r.start);
    return start > adesso && start <= traUnOra;//ritorna true se start è dopo adesso e se start è tra meno di un ora
  });

  if (prenotazioneImminente) {
    return "parziale"; // Arancione - prenotazione entro 1 ora
  }

  return "libero"; // Verde - libero
}

export function isTavoloTemporaneamenteLibero(tavolo) {
  if (!tavolo.reservations || tavolo.reservations.length === 0) return null;

  const adesso = new Date();
  
  // Verifica se c'è una prenotazione che inizia nel futuro prossimo (entro 1 ora)
  const prossimaPrenotazione = tavolo.reservations.find(function(r) {
    const inizio = dataUTCLocale(r.start);
    const traUnOra = new Date(adesso.getTime() + SOGLIA_PRENOTAZIONE_IMMINENTE);
    return inizio > adesso && inizio <= traUnOra;
  });

  if (!prossimaPrenotazione) return null;

  // Calcola quanto tempo manca
  const differenzaMs = dataUTCLocale(prossimaPrenotazione.start) - adesso;
  const minuti = Math.floor(differenzaMs / 1000 / 60);
  const ore = Math.floor(minuti / 60);
  const minutiRestanti = minuti % 60;

  let tempoFormattato;
  if (ore > 0) {
    tempoFormattato = `${ore}h ${minutiRestanti} minuti`;
  } else {
    tempoFormattato = `${minuti} minuti`;
  }

  return {
    tempo: tempoFormattato,
    username: prossimaPrenotazione.username,
    inizio: dataUTCLocale(prossimaPrenotazione.start),
  };
}


export function tempoRimanentePrenotazione(tavolo) {
  if (!tavolo.reservations || tavolo.reservations.length === 0) return null;

  const adesso = new Date();
  
  // Trova la prenotazione attualmente in corso
  const prenotazioneInCorso = tavolo.reservations.find(function(r) {
    const inizio = dataUTCLocale(r.start);
    const fine = dataUTCLocale(r.end);
    return inizio <= adesso && adesso < fine;
  });

  if (!prenotazioneInCorso) return null;

  // Calcola quanto tempo manca alla fine
  const fine = dataUTCLocale(prenotazioneInCorso.end);
  const differenzaMs = fine - adesso;
  const minuti = Math.floor(differenzaMs / 1000 / 60);
  const ore = Math.floor(minuti / 60);
  const minutiRestanti = minuti % 60;

  if (ore > 0) {
    return `${ore}h ${minutiRestanti}m`;
  }
  return `${minuti}m`;
}


export function tempoAllaProssimaPrenotazione(tavolo, giorno) {
  if (!tavolo.reservations || tavolo.reservations.length === 0) return null;

  const adesso = new Date();
  
  // Filtra solo le prenotazioni del giorno specificato
  const { filtraPrenotazioniPerGiorno } = require("./dateUtils");
  const prenotazioniGiorno = filtraPrenotazioniPerGiorno(tavolo.reservations, giorno);
  
  if (prenotazioniGiorno.length === 0) return null;
  
  // Trova la prossima prenotazione futura per il giorno specificato
  const prossimaPrenotazione = prenotazioniGiorno
    .map(function(r) { 
      return { ...r, start: dataUTCLocale(r.start) };
    })
    .filter(function(r) { 
      return r.start > adesso;
    })
    .sort(function(a, b) { 
      return a.start - b.start;
    })[0];

  if (!prossimaPrenotazione) return null;

  const differenzaMs = prossimaPrenotazione.start - adesso;
  const minuti = Math.floor(differenzaMs / 1000 / 60);
  const ore = Math.floor(minuti / 60);
  const minutiRestanti = minuti % 60;

  if (ore > 0) {
    return `${ore}h ${minutiRestanti}m`;
  }
  return `${minuti}m`;
}

export function isUsernameEsistente(tavoli, username){
  if (!username || !tavoli ) return false;

  for(let i=0; i<tavoli.length; i++){
    const tavolo = tavoli[i];
    if(tavolo.reservations && tavolo.reservations.length > 0){
      for(let j=0; j<tavolo.reservations.length; j++){
        const prenotazione = tavolo.reservations[j];
        if(prenotazione.username.toLowerCase() === username.toLowerCase()){
          return true;
        }
      }
    }
  }
  return false;
}