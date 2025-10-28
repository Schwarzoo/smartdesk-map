import { useState, useEffect } from "react";
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from "../constants/config";

// =====================
// 🔍 CUSTOM HOOK - GESTIONE ZOOM E PAN
// =====================

export function useZoom(areaRef) {//areaRef è il riferimento all'elemento DOM passato da App.js
  const [zoom, setZoom] = useState(1);//variabile per lo zoom modificabile da setZoom

  useEffect(function() {
    const area = areaRef.current;//area è l'elemento DOM effettivo
    if (!area) return;

    function handleWheel(e) {
      e.preventDefault();//fermiamo qualunque evento sulla mappa
      
      
      const delta = -e.deltaY * ZOOM_STEP; //delta.y è il valore della rotellina (- se verso di te)
      const nuovoZoom = Math.min(Math.max(zoom + delta, ZOOM_MIN), ZOOM_MAX);
      setZoom(nuovoZoom);//mettiamo il nuovo zoom calcolato
    }

    area.addEventListener("wheel", handleWheel, { passive: false });//passive dice se dentro la funzione handleWheel chiameremo preventDefault o no
    return function() {
      area.removeEventListener("wheel", handleWheel); //rimuoviamo il listener perchè useZoom viene chiamato quando zoom cambia
    };
  }, [zoom, areaRef]);

  return { zoom };
}
