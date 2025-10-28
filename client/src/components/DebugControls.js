import React from "react";
import { creaPrenotazioniCasuali, cancellaPrenotazioni } from "../utils/apiService";

// =====================
// 🛠️ COMPONENTE DEBUG CONTROLS
// =====================

/**
 * Componente con pulsanti di debug per test
 * @param {Object} props - { tavoli, onAggiornamento }
 */
function DebugControls({ tavoli, onAggiornamento }) {
  
  async function handleCreaPrenotazioniCasuali() {
    try {
      const numPrenotazioni = await creaPrenotazioniCasuali(tavoli);
      await onAggiornamento();
      alert(`${numPrenotazioni} prenotazioni casuali create per oggi e domani!`);
    } catch (e) {
      alert(e.message || "Errore durante la creazione delle prenotazioni casuali");
    }
  }

  async function handleCancellaPrenotazioni() {
    if (!window.confirm("Sei sicuro di voler cancellare TUTTE le prenotazioni?")) {
      return;
    }
    
    try {
      await cancellaPrenotazioni(tavoli);
      await onAggiornamento();
      alert("Tutte le prenotazioni sono state cancellate!");
    } catch (e) {
      alert("Errore durante la cancellazione delle prenotazioni");
    }
  }

  return (
    <div className="debug-container">
      <button className="btn-debug" onClick={handleCreaPrenotazioniCasuali}>
        Crea prenotazioni casuali
      </button>
      <button className="btn-debug delete" onClick={handleCancellaPrenotazioni}>
        Cancella tutte
      </button>
    </div>
  );
}

export default DebugControls;
