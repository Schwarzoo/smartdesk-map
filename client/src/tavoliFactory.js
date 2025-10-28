// Factory per generare l'array iniziale dei tavoli
// Restituisce una funzione pura che costruisce l'array
export function createTavoli() {
  const spacing = 40; // distanza verticale tra i tavoli
  const startX = 40; // posizione orizzontale iniziale
  const startY = 40; // posizione verticale iniziale
  const tavoliIniziali = [];

  // --- PRIMO BLOCCO (due colonne da 11 tavoli) ---
  for (let i = 1; i <= 22; i++) {
    let colonna, riga;

    if (i <= 11) {
      colonna = 0; // prima colonna
      riga = i - 1; // da 0 a 10
    } else {
      colonna = 1; // seconda colonna
      riga = i - 12; // da 0 a 10
    }

    const x = startX + colonna * 40; // seconda colonna spostata di 40px
    const y = startY + riga * spacing;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  // --- SECONDO BLOCCO (due colonne da 10 tavoli) ---
  for (let i = 23; i <= 42; i++) {
    let colonna, riga;

    if (i <= 32) {
      colonna = 0;
      riga = i - 23; // da 0 a 9
    } else {
      colonna = 1;
      riga = i - 33; // da 0 a 9
    }

    const x = startX + 100 + colonna * 40;
    const y = startY + riga * spacing;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  // --- TERZO BLOCCO (due colonne da 10 tavoli) ---
  for (let i = 43; i <= 58; i++) {
    let colonna, riga;

    if (i <= 50) {
      colonna = 0;
      riga = i - 43;
    } else {
      colonna = 1;
      riga = i - 51;
    }

    const x = startX + 220 + colonna * 40;
    const y = startY + riga * spacing;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  // --- QUARTO BLOCCO (due colonne da 10 tavoli) ---
  for (let i = 59; i <= 74; i++) {
    let colonna, riga;

    if (i <= 66) {
      colonna = 0;
      riga = i - 59;
    } else {
      colonna = 1;
      riga = i - 67;
    }

    const x = startX + 320 + colonna * 40;
    const y = startY + riga * spacing;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  // --- QUINTO BLOCCO (due colonne da 10 tavoli) ---
  for (let i = 75; i <= 83; i++) {
    const colonna = i - 74;
    const x = startX + 100 + colonna * spacing;
    const y = 550;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
      rotazione: 90,
    });
  }

  // --- SESTO BLOCCO (due colonne da 10 tavoli) ---
  for (let i = 84; i <= 99; i++) {
    let colonna, riga;

    if (i <= 91) {
      colonna = 0;
      riga = i - 84;
    } else {
      colonna = 1;
      riga = i - 92;
    }

    const x = startX + 440 + colonna * 40;
    const y = startY + riga * spacing;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 100; i <= 115; i++) {
    let colonna, riga;

    if (i <= 107) {
      colonna = 0;
      riga = i - 100;
    } else {
      colonna = 1;
      riga = i - 108;
    }

    const x = startX + 540 + colonna * 40;
    const y = startY + riga * spacing;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  // --- SETTIMO BLOCCO (due colonne da 10 tavoli) ---
  for (let i = 116; i <= 123; i++) {
    let colonna, riga;

    if (i <= 119) {
      // Tavoli 116–119 → prima colonna (sinistra)
      colonna = 0;
      riga = i - 116; // da 0 a 3
    } else {
      // Tavoli 120–123 → seconda colonna (destra)
      colonna = 1;
      riga = i - 120; // da 0 a 3
    }

    const x = startX + 540 + colonna * 40; // seconda colonna spostata di 40px in X
    const y = startY + riga * spacing + 450; // distanziamento verticale

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 124; i <= 131; i++) {
    let colonna, riga;

    if (i <= 127) {
      // Tavoli 124–127 → prima colonna (sinistra)
      colonna = 0;
      riga = i - 124; // da 0 a 3
    } else {
      // Tavoli 128–131 → seconda colonna (destra)
      colonna = 1;
      riga = i - 128; // da 0 a 3
    }

    const x = startX + 640 + colonna * 40; // seconda colonna spostata di 40px in X
    const y = startY + riga * spacing + 450; // distanziamento verticale

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 132; i <= 139; i++) {
    let colonna, riga;

    if (i <= 135) {
      // Tavoli 132–135 → prima colonna (sinistra)
      colonna = 0;
      riga = i - 132; // da 0 a 3
    } else {
      // Tavoli 136–139 → seconda colonna (destra)
      colonna = 1;
      riga = i - 136; // da 0 a 3
    }

    const x = startX + 760 + colonna * 40; // seconda colonna spostata di 40px in X
    const y = startY + riga * spacing + 450; // distanziamento verticale

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 140; i <= 147; i++) {
    let colonna, riga;

    if (i <= 143) {
      // Tavoli 140–143 → prima colonna (sinistra)
      colonna = 0;
      riga = i - 140; // da 0 a 3
    } else {
      // Tavoli 144–147 → seconda colonna (destra)
      colonna = 1;
      riga = i - 144; // da 0 a 3
    }

    const x = startX + 860 + colonna * 40; // seconda colonna spostata di 40px in X
    const y = startY + riga * spacing + 450; // distanziamento verticale

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 148; i <= 155; i++) {
    let colonna, riga;

    if (i <= 151) {
      // Tavoli 148–151 → prima colonna (sinistra)
      colonna = 0;
      riga = i - 148; // da 0 a 3
    } else {
      // Tavoli 152–155 → seconda colonna (destra)
      colonna = 1;
      riga = i - 152; // da 0 a 3
    }

    const x = startX + 980 + colonna * 40; // seconda colonna spostata di 40px in X
    const y = startY + riga * spacing + 450; // distanziamento verticale

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 156; i <= 163; i++) {
    let colonna, riga;

    if (i <= 159) {
      // Tavoli 156–159 → prima colonna (sinistra)
      colonna = 0;
      riga = i - 156; // da 0 a 3
    } else {
      // Tavoli 160–163 → seconda colonna (destra)
      colonna = 1;
      riga = i - 160; // da 0 a 3
    }

    const x = startX + 1100 + colonna * 40; // seconda colonna spostata di 40px in X
    const y = startY + riga * spacing + 450; // distanziamento verticale

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 164; i <= 171; i++) {
    let colonna, riga;

    if (i <= 167) {
      // Tavoli 164–167 → prima colonna (sinistra)
      colonna = 0;
      riga = i - 164; // da 0 a 3
    } else {
      // Tavoli 168–171 → seconda colonna (destra)
      colonna = 1;
      riga = i - 168; // da 0 a 3
    }

    const x = startX + 1200 + colonna * 40; // seconda colonna spostata di 40px in X
    const y = startY + riga * spacing + 450; // distanziamento verticale

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 172; i <= 187; i++) {
    let colonna, riga;

    if (i <= 179) {
      colonna = 0;
      riga = i - 172;
    } else {
      colonna = 1;
      riga = i - 180;
    }

    const x = startX + 980 + colonna * 40;
    const y = startY + riga * spacing;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  for (let i = 188; i <= 203; i++) {
    let colonna, riga;

    if (i <= 195) {
      colonna = 0;
      riga = i - 188;
    } else {
      colonna = 1;
      riga = i - 196;
    }

    const x = startX + 1100 + colonna * 40;
    const y = startY + riga * spacing;

    tavoliIniziali.push({
      id: i,
      x: x,
      y: y,
      occupato: false,
    });
  }

  return tavoliIniziali;
}
