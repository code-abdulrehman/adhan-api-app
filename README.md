## Adhan App (Prayer Times + Qibla)

Simple static app that generates yearly prayer times JSON and displays it in a browser with filtering (full year, month, today, single day), timezone/method/coords controls, geolocation, qibla direction, and JSON export of the visible data.

### Repo
- git clone https://github.com/code-abdulrehman/adhan-api-app/

### Prerequisites
- Node.js 18+

### Setup
```bash
npm install
```

### Generate data
```bash
node index.js   # creates prayerTimes.json for the current year
```
- Optional: set a different year: `YEAR=2026 node index.js`

### Run the dev server
```bash
npm run dev     # serves project at http://localhost:3000/
```
Then open `http://localhost:3000/` (loads `index.html` and uses `prayerTimes.json`).

### In the browser (index.html)
- Choose View: Full Year / Month / Today / Single Day.
- Select timezone, calculation method, and lat/lng; use “Use my location” if permitted.
- Click Apply for custom calculations; otherwise it reads from `prayerTimes.json`.
- Qibla direction and coordinates are shown; export the currently displayed table via “Export shown data (JSON)”.

