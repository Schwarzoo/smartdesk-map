import React, { useState } from "react";
import { generaOrariInizio, generaOrariFine } from "../utils/timeUtils";
import { formatDateTime, filtraPrenotazioniPerGiorno, oraAData } from "../utils/dateUtils";
import { 
  isReservedNow, 
  isTavoloTemporaneamenteLibero, 
  tempoRimanentePrenotazione,
  tempoAllaProssimaPrenotazione,
  isSlotOccupato,
  getClasseTavolo,
  isUsernameEsistente
} from "../utils/tavoloUtils";
import { prenotaTavolo as apiPrenotaTavolo } from "../utils/apiService";

// =====================
// 📋 COMPONENTE POPUP PRENOTAZIONE
// =====================

/**
 * Componente popup per prenotare un tavolo
 * @param {Object} props - { tavolo, onChiudi, onAggiornamento }
 */
function PopupPrenotazione({ tavolo,tavoli, onChiudi, onAggiornamento }) {
  const [visualizzaGiorno, setVisualizzaGiorno] = useState("oggi");
 

  const [form, setForm] = useState({ 
    username: "", 
    giorno: "oggi",
    oraInizio: "", 
    oraFine: "" 
  });

  if (!tavolo) return null;

  function cambiaGiorno(nuovoGiorno) {
    setVisualizzaGiorno(nuovoGiorno);
    setForm({ 
      username: form.username, 
      giorno: nuovoGiorno, 
      oraInizio: "", 
      oraFine: "" 
    });
  }

  function isIntervalloDiponibile() {
    if (!form.oraInizio || !form.oraFine) return true;
    
    const dataInizio = oraAData(form.oraInizio, form.giorno);
    const dataFine = oraAData(form.oraFine, form.giorno);
    
    return !isSlotOccupato(tavolo, dataInizio, dataFine);
  }
  
  async function handlePrenota() {
    if (!form.username || !form.oraInizio || !form.oraFine) {
      alert("Inserisci il nome utente, ora di inizio e ora di fine");
      return;
    }
    
    // Controlla username esistente QUI, non prima
    if (isUsernameEsistente(tavoli, form.username)) {
      alert("⚠️ Username gia presente! Inseriscine uno diverso.");
      return;
    }

    // Verifica disponibilità
    if (!isIntervalloDiponibile()) {
      alert("⚠️ L'intervallo selezionato si sovrappone con una prenotazione esistente!");
      return;
    }

    const dataInizio = oraAData(form.oraInizio, form.giorno);
    const dataFine = oraAData(form.oraFine, form.giorno);

    try {
      await apiPrenotaTavolo(tavolo.id, form.username, dataInizio, dataFine);
      await onAggiornamento();
      onChiudi();
    } catch (e) {
      alert(e.message || "Errore durante la prenotazione");
    }
  }

  const prenotazioniGiorno = filtraPrenotazioniPerGiorno(tavolo.reservations, visualizzaGiorno);
  const tavoloLiberoTemp = isTavoloTemporaneamenteLibero(tavolo);
  const tempoRimanente = tempoRimanentePrenotazione(tavolo);
  const tempoProx = tempoAllaProssimaPrenotazione(tavolo, visualizzaGiorno);
  const orariInizio = generaOrariInizio(form.giorno);
  const orariFine = generaOrariFine(form.oraInizio, form.giorno);
  const classeTavolo = visualizzaGiorno === "oggi" ? getClasseTavolo(tavolo) : "";

  return (
    <div className="popup">
      <div className={`popup-content ${classeTavolo ? `popup-${classeTavolo}` : ""}`}>
        {
        <h2>Tavolo {tavolo.id}</h2>
        }
        {/* SELEZIONE GIORNO (OGGI/DOMANI) */}
        <div className="selezione-giorno">
          <button
            className={`btn-giorno ${visualizzaGiorno === "oggi" ? "attivo" : ""}`}
            onClick={() => cambiaGiorno("oggi")}
          >
            Oggi
          </button>
          <button
            className={`btn-giorno ${visualizzaGiorno === "domani" ? "attivo" : ""}`}
            onClick={() => cambiaGiorno("domani")}
          >
            Domani
          </button>
        </div>

        {/* SEZIONE PRENOTAZIONI FILTRATE PER GIORNO */}
        {prenotazioniGiorno.length > 0 && (
          <div className="prenotazioni-esistenti">
            <h3>Prenotazioni {visualizzaGiorno === "oggi" ? "di oggi" : "di domani"}</h3>
            <ul className="lista-prenotazioni">
              {prenotazioniGiorno.map(function(r, idx) {
                return (
                  <li key={idx} className="prenotazione-item">
                    <small>
                      {formatDateTime(r.start)} → {formatDateTime(r.end)}
                    </small>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* TAVOLO TEMPORANEAMENTE LIBERO (solo se visualizzi oggi e non è occupato ora) */}
        {visualizzaGiorno === "oggi" && !isReservedNow(tavolo) && tavoloLiberoTemp  && (
          <div className="tavolo-libero-temp">
            <strong>Tavolo libero per {tavoloLiberoTemp.tempo}</strong>
            <br />
          </div>
        )}

        {/* TEMPO ALLA PROSSIMA PRENOTAZIONE (per qualsiasi giorno, se tavolo libero) */}
        {visualizzaGiorno === "oggi" &&!isReservedNow(tavolo) && tempoProx && !tavoloLiberoTemp&& (
          <div className="tavolo-libero-temp">
            <strong>Prossima prenotazione tra: {tempoProx}</strong>
          </div>
        )}

        {/* TEMPO RIMANENTE PRENOTAZIONE IN CORSO (solo se visualizzi oggi e il tavolo è occupato ora) */}
        {visualizzaGiorno === "oggi" && isReservedNow(tavolo) && tempoRimanente && (
          <div className="tempo-prenotazione">
            <strong>Tavolo occupato per: {tempoRimanente}</strong>
          </div>
        )}

        {/* FORM PRENOTAZIONE */}
        <div className="form-prenotazione">
          <label>Nome utente</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <label>Ora inizio</label>
          <select
            value={form.oraInizio}
            onChange={(e) => {
              const nuovaOraInizio = parseFloat(e.target.value);
              setForm({ 
                ...form, 
                oraInizio: nuovaOraInizio,
                oraFine: "" // Reset ora fine quando cambia l'inizio
              });
            }}
          >
            <option value="">Seleziona ora inizio...</option>
            {orariInizio.map(function(orario) {
              return (
                <option key={orario.valore} value={orario.valore}>
                  {orario.label}
                </option>
              );
            })}
          </select>

          <label>Ora fine (minimo 1 ora dopo)</label>
          <select
            value={form.oraFine}
            onChange={(e) => setForm({ ...form, oraFine: parseFloat(e.target.value) })}
            disabled={!form.oraInizio && form.oraInizio !== 0}
          >
            <option value="">Seleziona ora fine...</option>
            {orariFine.map(function(orario) {
              return (
                <option key={orario.valore} value={orario.valore}>
                  {orario.label}
                </option>
              );
            })}
          </select>

          {form.oraInizio !== "" && form.oraFine !== "" && (
            <div className={`riepilogo-orario ${!isIntervalloDiponibile() ? "non-disponibile" : ""}`}>
              {!isIntervalloDiponibile() && (
                <div className="avviso-non-disponibile">
                  Intervallo non disponibile!
                </div>
              )}
              <strong>Prenotazione:</strong>
              <br />
              {form.giorno === "oggi" ? "Oggi" : "Domani"} dalle{" "}
              {orariInizio.find(function(o) { return o.valore === form.oraInizio; })?.label} 
              {" "}alle {orariFine.find(function(o) { return o.valore === form.oraFine; })?.label}
              <br />
              <small>Durata: {form.oraFine - form.oraInizio} ore</small>
            </div>
          )}

          <div className="bottoni-container">
            <button
              className="btn conferma"
              onClick={handlePrenota}
              disabled={!isIntervalloDiponibile()}
            >
              Prenota
            </button>

            <button
              className="btn chiudi"
              onClick={onChiudi}
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupPrenotazione;
