import { useState, useEffect } from "react";
import { fetchTavoli as apiFetchTavoli, cancellaPrenotazioniPassate } from "../utils/apiService";
import { FETCH_INTERVAL, CLEANUP_INTERVAL } from "../constants/config";

// =====================
// 🪑 CUSTOM HOOK - GESTIONE TAVOLI
// =====================


export function useTavoli() {
  // STATO: Array dei tavoli (inizialmente vuoto)
  const [tavoli, setTavoli] = useState([]); //array vuoto iniziale modificabile dalla funzione setTavoli

  // FUNZIONE: Scarica tutti i tavoli dal server e aggiorna lo stato
  async function ricaricaTavoli() {
    try {
      // Scarica i dati dal server
      const datiDalServer = await apiFetchTavoli();
      
      // Sostituisci l'array vecchio con quello nuovo
      setTavoli(datiDalServer); //sostituimao l'array vuoto iniziale con i dati presi dal server tavoli=data
    } catch (errore) {
      console.error("Errore ricaricamento tavoli:", errore);
    }
  }

  // EFFECT 1: Caricamento iniziale e ricaricamento periodico
  useEffect(function() { //use effect viene chiamato dopo il rendering del componente
    // 1. Carica i tavoli SUBITO (prima volta)
    ricaricaTavoli();
    
    // 2. Avvia timer per ricaricare automaticamente ogni 30 secondi
    const timerRicaricamento = setInterval(ricaricaTavoli, FETCH_INTERVAL); //ricarichiamo i tavoli ogni tot
    
    // 3. Cleanup: ferma il timer quando il componente viene distrutto
    return function() {
      clearInterval(timerRicaricamento);
    };
  }, []); //questo array vuoto indica che useffect non dipende da nessuna variabile. Viene creato al mount

  // EFFECT 2: Cancellazione automatica prenotazioni passate
  useEffect(function() {
    // Controlla che ci siano tavoli prima di eseguire la pulizia
    if (tavoli.length > 0) {
      // FUNZIONE: Elimina le prenotazioni scadute
      async function eseguiPulizia() {
        try {
          // 1. Cancella le prenotazioni passate dal server
          await cancellaPrenotazioniPassate(tavoli);
          
          // 2. Ricarica i tavoli aggiornati per vedere i cambiamenti
          await ricaricaTavoli();
        } catch (errore) {
          console.error("Errore durante pulizia prenotazioni:", errore);
        }
      }
      
      // 1. Pulisci SUBITO (quando tavoli cambia)
      eseguiPulizia();
      
      // 2. Avvia timer per pulire automaticamente ogni 60 secondi
      const timerPulizia = setInterval(eseguiPulizia, CLEANUP_INTERVAL);
      
      // 3. Cleanup: ferma il timer quando tavoli cambia o il componente viene distrutto
      return function() {
        clearInterval(timerPulizia);
      };
    }
  }, [tavoli]);//questo hook viene eseguito quando tavoli cambia (ogni volta che viene aggiornato dall'API)

  return { 
    tavoli, 
    setTavoli, 
    ricaricaTavoli 
  };
}
