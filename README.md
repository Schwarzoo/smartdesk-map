# 🗺️ SmartDesk Map

Sistema di prenotazione tavoli interattivo con mappa visuale.

## 📁 Struttura

```
smartdesk-map/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── constants/
│   └── public/
│
└── server/          # Express backend
    ├── data/        # Storage JSON
    └── scripts/     # Utility scripts
```

## 🚀 Quick Start

### Client (React)
```bash
cd client
npm install
npm start
```
Apri [http://localhost:3000](http://localhost:3000)

### Server (Express)
```bash
cd server
npm install
npm run dev
```
Server in ascolto su porta 8080

## ☁️ Deploy

### Server su Fly.io
```bash
cd server
flyctl deploy
```

### Upload tavoli su server remoto
```bash
cd server
node scripts/uploadTables.js
```

## 🎯 Features

- ✅ Mappa interattiva con zoom
- ✅ Prenotazione tavoli con orari
- ✅ Validazione username unici
- ✅ Timer per prossima prenotazione
- ✅ Colori dinamici stato tavoli
- ✅ Pulizia automatica prenotazioni scadute
- ✅ Persistenza dati su cloud

## 🛠️ Tech Stack

**Frontend:** React, Custom Hooks, CSS Modules  
**Backend:** Express.js, JSON file storage  
**Deploy:** Fly.io con persistent volumes

---

**Autore:** Andrea  
**Data:** Ottobre 2025
