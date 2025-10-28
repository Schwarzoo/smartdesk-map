// =====================
// 🕐 UTILITÀ DATE E CONVERSIONI
// =====================

/**
 * Converte un numero di ora (es. 14.5 = 14:30) in un oggetto Date UTC
 * @param {number} oraNumero - L'ora in formato decimale (es. 14.5 per le 14:30)
 * @param {string} giorno - "oggi" o "domani"
 * @returns {Date} Data in formato UTC
 */
export function oraAData(oraNumero, giorno) {
  const oggi = new Date();
  let anno = oggi.getFullYear();
  let mese = oggi.getMonth();
  let giornoMese = oggi.getDate();

  if (giorno === "domani") {
    const domani = new Date(oggi);
    domani.setDate(domani.getDate() + 1);
    anno = domani.getFullYear();
    mese = domani.getMonth();
    giornoMese = domani.getDate();
  }

  const ore = Math.floor(oraNumero);
  const minuti = (oraNumero % 1) * 60;

  // Crea la data in UTC per evitare conversioni di timezone
  return new Date(Date.UTC(anno, mese, giornoMese, ore, minuti, 0, 0));
}

/**
 * Converte una stringa ISO UTC in un oggetto Date locale
 * Legge la data UTC dal JSON e la interpreta come ora locale
 * @param {string} isoString - Stringa ISO in formato UTC
 * @returns {Date} Data interpretata come ora locale
 */
export function dataUTCLocale(isoString) {
  const utcDate = new Date(isoString);
  return new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    utcDate.getUTCHours(),
    utcDate.getUTCMinutes(),
    utcDate.getUTCSeconds()
  );
}

/**
 * Formatta una data in formato leggibile italiano
 * @param {string} dateString - Stringa ISO della data
 * @returns {string} Data formattata (es. "27/10/2025, 14:30")
 */
export function formatDateTime(dateString) {
  const date = dataUTCLocale(dateString);
  return date.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Filtra le prenotazioni per un giorno specifico (oggi o domani)
 * @param {Array} prenotazioni - Array di prenotazioni
 * @param {string} giorno - "oggi" o "domani"
 * @returns {Array} Prenotazioni filtrate per il giorno specificato
 */
export function filtraPrenotazioniPerGiorno(prenotazioni, giorno) {
  if (!prenotazioni || prenotazioni.length === 0) return [];

  const adesso = new Date();
  let inizioGiorno, fineGiorno;

  if (giorno === "oggi") {
    inizioGiorno = new Date(adesso);
    inizioGiorno.setHours(0, 0, 0, 0);
    fineGiorno = new Date(adesso);
    fineGiorno.setHours(23, 59, 59, 999);
  } else {
    // domani
    inizioGiorno = new Date(adesso);
    inizioGiorno.setDate(inizioGiorno.getDate() + 1);
    inizioGiorno.setHours(0, 0, 0, 0);
    fineGiorno = new Date(inizioGiorno);
    fineGiorno.setHours(23, 59, 59, 999);
  }

  return prenotazioni.filter(function(r) {
    const dataInizio = dataUTCLocale(r.start);
    return dataInizio >= inizioGiorno && dataInizio <= fineGiorno;
  });
}
