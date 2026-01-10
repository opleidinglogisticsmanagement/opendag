# Open Dag - Logistics Management

Een moderne, interactieve website voor de Open Dag van de opleiding Logistics Management bij Windesheim Hogeschool.

## Features

- 🎯 **Hero Sectie**: Welkom studenten met een aantrekkelijke landing page
- 📚 **Over de Opleiding**: Informatie over Logistics Management
- ❓ **Interactieve Quiz**: Test je kennis over logistiek en supply chain management
- 🎮 **Mini-Games**: 
  - Packing Game: Pak dozen efficiënt in een container
  - Route Planning Game: Plan de meest efficiënte route door steden
- 📱 **Volledig Responsive**: Werkt perfect op mobiel, tablet en desktop

## Technologie

- **React** - Moderne UI library
- **Vite** - Snelle build tool en development server
- **Tailwind CSS** - Utility-first CSS framework
- **Kleurenschema**: Blauw, Oranje en Wit (logistiek thema)

## Installatie

1. Installeer dependencies:
```bash
npm install
```

2. Start de development server:
```bash
npm run dev
```

3. Open je browser en ga naar `http://localhost:5173`

## Build voor Productie

```bash
npm run build
```

De gebouwde bestanden staan in de `dist` folder.

## Project Structuur

```
my-logistics-openday/
├── public/              # Plaatjes, logo's van de hogeschool
├── src/
│   ├── assets/          # Specifieke game assets (sprites, geluidjes)
│   ├── components/      # De bouwblokken
│   │   ├── UI/          # Herbruikbare componenten (Button, Card)
│   │   ├── Quiz/        # Quiz componenten
│   │   ├── Games/       # Mini-games (PackingGame, RouteGame)
│   │   └── Layout/      # Header, Footer
│   ├── data/            # Quiz vragen data
│   ├── App.jsx          # Hoofdpagina
│   └── main.jsx         # Startpunt
├── index.html
└── tailwind.config.js
```

## Licentie

© 2024 Logistics Management - Windesheim
