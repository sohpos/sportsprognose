# ⚽ SportsPrognose

KI-gestützte Fußballprognosen mit Poisson-Modell — Web + Mobile (Monorepo).

## Architektur

```
sportsprognose/
├── apps/
│   ├── web/        → Next.js 14 + Tailwind (läuft auf Port 3000)
│   └── mobile/     → Expo React Native (iOS & Android)
├── packages/
│   └── core/       → Geteilte TypeScript-Typen & Utilities
└── backend/        → Express API-Server (läuft auf Port 3002)
```

## Schnellstart

### Voraussetzungen
- Node.js 18+
- npm 8+ (Workspaces)

### Installation

```bash
cd sportsprognose
npm install
```

### Backend starten

```bash
npm run dev:backend
# API läuft auf http://localhost:3002
```

### Live-Daten aktivieren (football-data.org)

1. Kostenlosen API-Key anlegen: https://www.football-data.org/
2. Datei anlegen:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. In `backend/.env` eintragen:
   ```
   FOOTBALL_API_KEY=dein_key_hier
   ```
4. Backend neu starten.

Ohne API-Key nutzt die App automatisch Mock-Daten als Fallback.


### Web-App starten

```bash
npm run dev:web
# Web läuft auf http://localhost:3000
```

### Mobile-App starten (Expo)

```bash
cd apps/mobile
npx expo start
# QR-Code mit Expo Go scannen
```

## API-Endpunkte

| Endpunkt | Beschreibung |
|---|---|
| `GET /api/matches` | Alle kommenden Spiele |
| `GET /api/matches?league=BL1` | Gefiltert nach Liga |
| `GET /api/matches/leagues` | Liste aller Ligen |
| `GET /api/predictions/:matchId` | Prognose für ein Spiel |
| `GET /api/predictions/stats/accuracy` | Trefferquote (8 Wochen) |

## Echte Daten (Optional)

Die App läuft standardmäßig mit realistischen Mock-Daten.
Für echte Spielpläne:

1. Kostenlosen API-Key holen: https://www.football-data.org/
2. `.env`-Datei im `backend/`-Ordner anlegen:
   ```
   FOOTBALL_API_KEY=dein_key_hier
   ```
3. `backend/src/services/footballDataApi.ts` implementieren (Vorlage kommentiert)

## Poisson-Modell

Das Modell berechnet die erwarteten Tore basierend auf:
- **Angriffsstärke** = Team avg Tore / Liga-Durchschnitt
- **Abwehrstärke** = Team avg Gegentore / Liga-Durchschnitt
- **Heimvorteil** = +10%

Zusätzlich: Dixon-Coles-Korrektur für Ergebnisse unter 2 Toren.

**Realistische Trefferquote: 55–65%**
Claims von 80%+ sind Marketing.

## Disclaimer

Diese App ist ein Lern- und Analyse-Tool. **Kein Aufruf zur Teilnahme an Sportwetten.**
Statistik ≠ Garantie. Spiele verantwortungsbewusst.
