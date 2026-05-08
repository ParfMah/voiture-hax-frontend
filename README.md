# 🚗 HAX-ISA — Frontend

**International Sale of Automobiles** — Sito pubblico Vanilla JS + HTML + CSS

---

## 📋 Requisiti

- Browser moderno (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Live Server o qualsiasi server HTTP statico
- Backend avviato su `http://localhost:3000`

---

## 🚀 Avvio rapido

### Opzione 1 — VS Code Live Server (Consigliato)
1. Apri la cartella `frontend/` in VS Code
2. Installa l'estensione **Live Server** (ritwick.vscode-liveserver)
3. Click destro su `index.html` → **Open with Live Server**
4. Il sito si apre su `http://localhost:5500`

### Opzione 2 — Python HTTP Server
```bash
cd frontend
python3 -m http.server 5500
# Apri http://localhost:5500
```

### Opzione 3 — Node HTTP Server
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

---

## 📁 Struttura

```
frontend/
├── index.html                    ← Homepage
├── pages/
│   ├── catalogue.html            ← Catalogo con filtri
│   ├── vehicle-detail.html       ← Dettaglio + simulatore
│   ├── checkout.html             ← Acquisto 5 step
│   ├── confirmation.html         ← Conferma ordine
│   ├── about.html                ← Chi siamo
│   └── contact.html              ← Contatti
├── css/
│   ├── variables.css             ← Design tokens (colori, font, spacing)
│   ├── global.css                ← Stili base, bottoni, form, modal
│   ├── navbar.css / footer.css   ← Layout
│   ├── hero.css / home.css       ← Homepage
│   ├── catalogue.css             ← Filtri, griglia, paginazione
│   ├── vehicle-detail.css        ← Galleria, tabs, specs
│   ├── credit-simulator.css      ← Widget finanziamento
│   ├── checkout.css              ← Step progress, form
│   ├── confirmation.css          ← Pagina conferma
│   └── animations.css            ← Keyframes, scroll-reveal
└── js/
    ├── config.js                 ← Configurazione globale
    ├── main.js                   ← Entry point, animazioni
    ├── utils/
    │   ├── api.js                ← Chiamate HTTP backend
    │   ├── helpers.js            ← Formattazione, validazione
    │   └── storage.js            ← LocalStorage manager
    ├── components/
    │   ├── navbar.js             ← Navbar dinamica + mobile
    │   ├── footer.js             ← Footer dinamico
    │   ├── toast.js              ← Notifiche
    │   ├── modal.js              ← Dialog generica
    │   ├── loader.js             ← Page loader
    │   └── credit-simulator.js   ← Simulatore finanziamento
    └── pages/
        ├── home.js               ← Hero, servizi, veicoli, testimonials
        ├── catalogue.js          ← Filtri, ricerca, paginazione
        ├── vehicle-detail.js     ← Galleria, tabs, form richiesta
        ├── checkout.js           ← Percorso 5 step
        ├── confirmation.js       ← Pagina conferma
        ├── about.js              ← Chi siamo
        └── contact.js            ← Contatti + form
```

---

## ⚙️ Configurazione API

Modifica `js/config.js` per puntare al backend:

```javascript
api: {
  baseUrl: 'http://localhost:3000/api',  // URL del backend
}
```

---

## 🎨 Design System

| Token | Valore | Uso |
|-------|--------|-----|
| `--color-primary` | `#C0392B` | Rosso Italia — bottoni, accenti |
| `--color-secondary` | `#D4A017` | Oro — prezzi, highlights |
| `--color-accent` | `#2C3E50` | Antracite — sfondi scuri |
| `--navbar-height` | `72px` | Offset contenuto |

---

## 💳 Simulatore Credito

Il componente `CreditSimulator` è riutilizzabile:

```javascript
CreditSimulator.init({
  container:    document.getElementById('mio-widget'),
  vehiclePrice: 35000,
  vehicleId:    'v01',
  onResult: (result) => {
    console.log(result.monthly);  // rata mensile
    console.log(result.isValid);  // acconto sufficiente?
  }
});
```

**Vincoli bloccanti:**
- Acconto minimo: **10% del prezzo** (bloquant)
- Tasso: **2.0% – 3.5%** TAN
- Durata: **12 – 84 mesi** (step 12)

---

*Hax-ISA Frontend v1.0.0 — Vanilla JS, no framework*
