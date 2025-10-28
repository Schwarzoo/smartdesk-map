import React from "react";
import { MURI } from "../constants/mockData";
import Tavolo from "./Tavolo";

// =====================
// 🗺️ COMPONENTE MAPPA
// =====================

/**
 * Componente che renderizza la mappa con tavoli e muri
 * @param {Object} props - { tavoli, zoom, areaRef, onSelezionaTavolo }
 */
function Mappa({ tavoli, zoom, areaRef, onSelezionaTavolo }) {
  return (
    <div className="area" ref={areaRef}>
      <div
        className="contenuto-area"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Renderizza i muri */}
        {MURI.map(function(muro) {
          return (
            <div
              key={muro.id}
              className="muro"
              style={{
                left: muro.x,
                top: muro.y,
                width: muro.larghezza,
                height: muro.altezza,
              }}
            ></div>
          );
        })}

        {/* Renderizza i tavoli */}
        {tavoli.map(function(tavolo) {
          return (
            <Tavolo 
              key={tavolo.id} 
              tavolo={tavolo} 
              onSeleziona={onSelezionaTavolo}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Mappa;
