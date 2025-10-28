import React, { useState } from "react";
import { liberaTavoloTemporaneo } from "../utils/apiService";

// =====================
// 🔓 COMPONENTE POPUP LIBERA TAVOLO
// =====================

/**
 * Componente popup per liberare temporaneamente un tavolo
 * @param {Object} props - { mostra, onChiudi, tavoli, onAggiornamento }
 */
function PopupLiberaTavolo({ mostra, onChiudi, tavoli, onAggiornamento }) {
  const [username, setUsername] = useState("");

  if (!mostra) return null;

  async function handleLibera() {
    try {
      const risultato = await liberaTavoloTemporaneo(username, tavoli);
      await onAggiornamento();
      setUsername("");
      onChiudi();
      alert(risultato.message);
    } catch (e) {
      alert(e.message || "Errore durante la liberazione del tavolo");
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleLibera();
    }
  }

  return (
    <div className="popup">
      <div className="popup-content popup-libera">
        <h2>🔓 Libera Tavolo Temporaneamente</h2>
        <p className="info-libera">
          Inserisci il tuo nome utente per interrompere la tua prenotazione per 1 ora.
          Il tavolo diventerà arancione e sarà nuovamente disponibile.
        </p>

        <label>👤 Nome utente</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <div className="bottoni-container">
          <button
            className="btn conferma"
            onClick={handleLibera}
          >
            Libera per 1 ora
          </button>

          <button
            className="btn chiudi"
            onClick={() => {
              onChiudi();
              setUsername("");
            }}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupLiberaTavolo;
