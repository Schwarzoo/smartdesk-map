import React from "react";
import { getClasseTavolo } from "../utils/tavoloUtils";

// =====================
// 🪑 COMPONENTE TAVOLO
// =====================

function Tavolo({ tavolo, onSeleziona }) {
  return (
    <div
      className={`tavolo ${getClasseTavolo(tavolo)}`} //ottiene la classe del tavolo in base al suo stato
      style={{
        left: tavolo.x,//posizione orizzontale
        top: tavolo.y,//posizione verticale
        transform: `rotate(${tavolo.rotation || 0}deg)`,//rotiamo il tavolo se è un tavolo orrizzontaleì
      }}
      onClick={() => onSeleziona(tavolo)}//funziona per gestire il click del tavolo
    >
      <span
        style={{
          display: "inline-block",
          transform: `rotate(-${tavolo.rotation || 0}deg)`,//testo dentro il tavolo
        }}
      >
        {tavolo.id}
      </span>
    </div>
  );
}

export default Tavolo;
