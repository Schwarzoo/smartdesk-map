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
  let oraPartenza = 0;
  if (giorno === "oggi") {
    oraPartenza = Math.ceil(oraCorrente * 2) / 2; // Arrotonda alla mezz'ora successiva
  }
  
  for (let ora = Math.max(0, Math.floor(oraPartenza)); ora < ORA_MASSIMA; ora++) {
    const mezz = [0, INCREMENTO_MEZZ_ORA];
    mezz.forEach(function(m) {
      const oraTotale = ora + m;
      if (oraTotale >= oraPartenza && oraTotale < ORA_MASSIMA) {
        const minuti = m === INCREMENTO_MEZZ_ORA ? "30" : "00";
        orari.push({ valore: oraTotale, label: `${ora}:${minuti}` });
      }
    });
  }
  return orari;
}

/**
 * Genera gli orari disponibili per la fine della prenotazione
 * Minimo 1 ora dopo l'inizio, massimo fino a mezzanotte
 * @param {number} oraInizio - Ora di inizio in formato decimale
 * @param {string} giorno - "oggi" o "domani" (attualmente non usato ma disponibile)
 * @returns {Array} Array di oggetti {valore, label} con gli orari disponibili
 */
export function generaOrariFine(oraInizio, giorno) {
  if (!oraInizio && oraInizio !== 0) return [];
  
  const orari = [];
  const oraMinima = oraInizio + DURATA_MINIMA; // Minimo 1 ora dopo
  const oraMassima = ORA_MASSIMA; // Fino a mezzanotte (00:00 del giorno dopo)
  
  let oraCorrente = oraMinima;
  while (oraCorrente <= oraMassima) {
    const ora = Math.floor(oraCorrente) % ORA_MASSIMA;
    const minuti = (oraCorrente % 1) === INCREMENTO_MEZZ_ORA ? "30" : "00";
    orari.push({ 
      valore: oraCorrente, 
      label: `${ora}:${minuti}` 
    });
    oraCorrente += INCREMENTO_MEZZ_ORA; // Incremento di 30 minuti
  }
  
  return orari;
}
