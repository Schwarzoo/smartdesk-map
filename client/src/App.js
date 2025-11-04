import React, { useState, useRef } from "react";
import "./App.css";
import Mappa from "./components/Mappa";
import PopupPrenotazione from "./components/PopupPrenotazione";
import PopupLiberaTavolo from "./components/PopupLiberaTavolo";
import DebugControls from "./components/DebugControls";
import { useTavoli } from "./hooks/useTavoli";
import { useZoom } from "./hooks/useZoom";

// =====================
// 🏠 COMPONENTE PRINCIPALE APP
// =====================

function App() {
  const [tavoloSelezionato, setTavoloSelezionato] = useState(null);
  const [mostraPopupLibera, setMostraPopupLibera] = useState(false);
  const areaRef = useRef(null);

  // Custom hooks per gestione tavoli e zoom
  const { tavoli, ricaricaTavoli } = useTavoli();
  const { zoom, offset, zoomIn, zoomOut } = useZoom(areaRef);

  // handlers inlined directly in JSX below (removed small wrappers)

  return (
    <div className="mappa">
      <h1 className="titolo">SmartDesk Map</h1>

      <div className="info-text">
        <p>Seleziona un tavolo per effettuare una prenotazione. Usa i pulsanti di zoom sulla mappa</p>
      </div>

      {/* PULSANTE LIBERA TAVOLO */}
      <div className="libera-container">
        <button 
          className="btn-libera-principale" 
          onClick={() => setMostraPopupLibera(true)}
        >
          Libera Tavolo
        </button>
      </div>

      {/* CONTROLLI DEBUG */}
      <DebugControls 
        tavoli={tavoli} 
        onAggiornamento={ricaricaTavoli} 
      />

      {/* MAPPA CON TAVOLI E MURI */}
      <Mappa 
        tavoli={tavoli}
        zoom={zoom}
        offset={offset}
        areaRef={areaRef}
        onSelezionaTavolo={(t) => setTavoloSelezionato(t)}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />

      {/* POPUP PRENOTAZIONE */}
      <PopupPrenotazione 
        tavolo={tavoloSelezionato}
        tavoli={tavoli}
        onChiudi={() => setTavoloSelezionato(null)}
        onAggiornamento={ricaricaTavoli}
      />

      {/* POPUP LIBERA TAVOLO */}
      <PopupLiberaTavolo 
        mostra={mostraPopupLibera}
        onChiudi={() => setMostraPopupLibera(false)}
        tavoli={tavoli}
        onAggiornamento={ricaricaTavoli}
      />
    </div>
  );
}

export default App;