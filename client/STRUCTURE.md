# SmartDesk Map - Struttura del Progetto

## 📂 Struttura delle Cartelle

```
client/src/
├── components/          # Componenti React riutilizzabili
│   ├── Mappa.js        # Componente mappa con tavoli e muri
│   ├── Tavolo.js       # Componente singolo tavolo
│   ├── PopupPrenotazione.js      # Popup per prenotare un tavolo
│   ├── PopupLiberaTavolo.js      # Popup per liberare temporaneamente
│   └── DebugControls.js          # Controlli debug (test)
│
├── hooks/              # Custom React Hooks
│   ├── useTavoli.js    # Gestione stato tavoli e auto-cleanup
│   └── useZoom.js      # Gestione zoom e pan della mappa
│
├── utils/              # Funzioni di utilità
│   ├── apiService.js   # Tutte le chiamate API al backend
│   ├── dateUtils.js    # Conversioni e formattazione date UTC
│   ├── timeUtils.js    # Generazione orari disponibili
│   └── tavoloUtils.js  # Logica stato e colore tavoli
│
├── constants/          # Costanti e configurazioni
│   ├── config.js       # Configurazione API, zoom, intervalli
│   └── mockData.js     # Dati mock (muri, nomi test)
│
├── styles/             # CSS modulari per componente
│   ├── base.css        # Stili globali e base
│   ├── mappa.css       # Stili area mappa e muri
│   ├── tavolo.css      # Stili tavoli (colori, hover)
│   ├── popup.css       # Stili popup prenotazione
│   ├── popupLibera.css # Stili popup libera tavolo
│   └── debug.css       # Stili controlli debug
│
├── App.js              # Componente principale (orchestrazione)
├── App.css             # Import di tutti i CSS modulari
└── index.js            # Entry point React
```

## 🧩 Architettura

### **Separazione delle Responsabilità**

#### **1. Components** - Presentazione UI
- `Mappa.js`: Renderizza l'area con tavoli e muri
- `Tavolo.js`: Singolo tavolo con gestione click
- `PopupPrenotazione.js`: Form completo prenotazione
- `PopupLiberaTavolo.js`: Form liberazione temporanea
- `DebugControls.js`: Pulsanti per test e debug

#### **2. Hooks** - Logica React riutilizzabile
- `useTavoli()`: 
  - Carica tavoli dal server
  - Ricarica automatica ogni 30 secondi
  - Pulizia prenotazioni passate ogni 60 secondi
- `useZoom()`:
  - Gestione zoom con CTRL+wheel
  - Pan orizzontale (blocca verticale)

#### **3. Utils** - Logica business
- `apiService.js`: Tutte le chiamate fetch centralizzate
  - `fetchTavoli()`, `prenotaTavolo()`, `liberaTavolo()`
  - `liberaTavoloTemporaneo()`, `creaPrenotazioniCasuali()`
- `dateUtils.js`: Gestione date e timezone
  - `oraAData()`: Converte ora decimale → Date UTC
  - `dataUTCLocale()`: Legge UTC come locale
  - `formatDateTime()`, `filtraPrenotazioniPerGiorno()`
- `timeUtils.js`: Generazione slot orari
  - `generaOrariInizio()`, `generaOrariFine()`
- `tavoloUtils.js`: Logica stato tavoli
  - `isReservedNow()`, `isSlotOccupato()`
  - `getClasseTavolo()`, `tempoRimanentePrenotazione()`

#### **4. Constants** - Configurazione
- `config.js`: URL API, limiti zoom, intervalli timer
- `mockData.js`: Muri, nomi casuali per test

#### **5. Styles** - CSS modulari
- Un file CSS per ogni area di responsabilità
- Import centralizzato in `App.css`

## 🎯 Vantaggi della Nuova Struttura

### ✅ **Manutenibilità**
- Ogni file ha una responsabilità chiara
- Facile trovare e modificare codice specifico
- Meno probabilità di conflitti in team

### ✅ **Riusabilità**
- Componenti riutilizzabili in altri progetti
- Hook personalizzati esportabili
- Utilities condivisibili

### ✅ **Testabilità**
- Facile scrivere unit test per utils
- Component test isolati
- Mock semplificati

### ✅ **Scalabilità**
- Aggiungere nuove feature senza toccare codice esistente
- Espandibile con nuovi componenti/utils
- Performance ottimizzate (code splitting possibile)

### ✅ **Leggibilità**
- Codice organizzato logicamente
- Nomi file autoesplicativi
- Import chiari delle dipendenze

## 📝 Come Lavorare con Questa Struttura

### **Aggiungere una nuova feature:**
1. Creare componente in `components/`
2. Aggiungere logica in `utils/` se necessario
3. Creare hook custom in `hooks/` per stato complesso
4. Aggiungere costanti in `constants/`
5. Creare CSS dedicato in `styles/`

### **Modificare logica esistente:**
- **API?** → `utils/apiService.js`
- **Date/Orari?** → `utils/dateUtils.js` o `utils/timeUtils.js`
- **Stato tavoli?** → `utils/tavoloUtils.js`
- **UI?** → `components/`
- **Stili?** → `styles/`

### **Debug:**
- `DebugControls.js` per nuovi pulsanti test
- `mockData.js` per dati di test
- Console del browser per errori API

## 🔧 Tecnologie Utilizzate

- **React 18+** (hooks only)
- **CSS Modules** (modulari e isolati)
- **Fetch API** (chiamate HTTP)
- **Custom Hooks** (riutilizzabilità logica)

## 📦 Dipendenze

Nessuna libreria esterna richiesta - tutto vanilla React e JavaScript.

## 🚀 Esecuzione

```bash
# Client
cd client
npm start

# Server
cd server
node index.js
```

## 🎨 Convenzioni di Codice

- ✅ Funzioni esplicite (no arrow functions)
- ✅ Commenti descrittivi con emoji
- ✅ Nomi variabili in italiano (per consistenza progetto)
- ✅ Ogni funzione ha JSDoc comment
- ✅ CSS ordinato per sezioni logiche
