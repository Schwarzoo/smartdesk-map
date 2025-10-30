// Configurazione API
export const API_BASE = "https://smartdesk-backend.fly.dev/api";

// Configurazione Zoom
export const ZOOM_MIN = 0.27; // Ridotto per vedere tutti i tavoli su mobile
export const ZOOM_MAX = 2;
export const ZOOM_STEP = 0.001;

// Tempi di aggiornamento (in millisecondi)
export const FETCH_INTERVAL = 30000; // 30 secondi
export const CLEANUP_INTERVAL = 60000; // 60 secondi (1 minuto)

// Configurazione orari
export const ORA_MINIMA = 0;
export const ORA_MASSIMA = 24;
export const INCREMENTO_MEZZ_ORA = 0.5;
export const DURATA_MINIMA = 1; // 1 ora minimo

// Soglie temporali
export const SOGLIA_PRENOTAZIONE_IMMINENTE = 60 * 60 * 1000; // 1 ora in millisecondi
export const DURATA_LIBERAZIONE_TEMPORANEA = 60 * 60 * 1000; // 1 ora in millisecondi
