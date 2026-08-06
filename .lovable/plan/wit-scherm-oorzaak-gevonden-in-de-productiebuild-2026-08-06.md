# Wit scherm: oorzaak gevonden in de productiebuild

## Wat ik heb gemeten

Echte productiebuild (`vite build` + `vite preview` op poort 4173), headless browser, vijf routes:

| Route | #root inhoud | Fout |
|---|---|---|
| / | leeg (0 tekens) | `ReferenceError: Cannot access '_' before initialization` |
| /privacy | leeg | idem |
| /terms | leeg | idem |
| /aanvragen | leeg | idem |
| /auth | leeg | idem |

Stacktrace, identiek op elke route:

```text
ReferenceError: Cannot access '_' before initialization
    at http://localhost:4173/assets/charts-DP0cAROa.js:8:16445
```

De app crasht dus vóór de eerste render — daarom is het scherm wit, ook op de homepage. Dit is geen browsercache.

## Wat het NIET is

- **Geen 404's of MIME-fouten op chunks.** Alle JS-bestanden laden met HTTP 200; er zijn geen mislukte chunkverzoeken. Het enige mislukte verzoek is `google-analytics.com/g/collect` (extern, netwerkblokkade in de testomgeving, niet relevant).
- **Geen CSP-blokkade.** `applySecurityHeaders()` draait binnen een React-effect en wordt nooit bereikt omdat de crash daarvóór plaatsvindt. Er staan geen CSP-violations in de console. De CSP-zorg over `cdn.gpteng.co` blijft wel terecht als los aandachtspunt, maar veroorzaakt dit witte scherm niet.
- **Geen SPA-fallbackprobleem.** Directe navigatie naar /privacy en /terms levert gewoon index.html en de juiste chunks op.

## De echte oorzaak

De `manualChunks`-configuratie uit batch 3 in `vite.config.ts` snijdt de vendorcode op een plek door waar een circulaire afhankelijkheid tussen chunks ontstaat:

```text
react-vendor.js  --static import-->  charts.js
charts.js        --static import-->  react-vendor.js
```

Analyse van `dist/assets` bevestigt dit: `charts-*.js` importeert `react-vendor-*.js`, en `react-vendor-*.js` importeert `charts-*.js` terug. Bij zo'n cyclus tussen ES-modulechunks wordt een binding gelezen voordat die geïnitialiseerd is → de TDZ-fout `Cannot access '_' before initialization`, direct bij het opstarten.

Bijkomend signaal: de `charts`-chunk bevat React-DOM-code, wat laat zien dat de huidige regexregels gedeelde vendormodules over meerdere chunks verspreiden in plaats van in één chunk te houden.

Op de dev-server valt dit niet op, omdat Vite daar geen chunks bouwt — precies zoals je vermoedde.

## Voorgestelde oplossing

1. **`vite.config.ts` — chunkstrategie corrigeren.** De `charts`- en `pdf`-regels verwijderen (of vervangen door één veilige regel die alle `node_modules` in één `vendor`-chunk zet). Rollup bepaalt dan zelf een correcte, cyclusvrije chunkverdeling. De lazy routes uit batch 3 blijven volledig intact en blijven per pagina splitsen — de bundelwinst blijft dus grotendeels behouden.
2. **Herbouwen en opnieuw meten** op dezelfde vijf routes: bevestigen dat `#root` gevuld is, geen pageerrors, geen mislukte chunkverzoeken.
3. **Controle op chunkcycli** in de nieuwe `dist`: verifiëren dat geen twee chunks elkaar statisch importeren.
4. **Los aandachtspunt (alleen na akkoord):** `cdn.gpteng.co` toevoegen aan de `script-src` in `src/lib/security.ts`, zodat de CSP het previewscript niet blokkeert zodra de app wél rendert.

Geen visuele wijzigingen; dit raakt alleen de buildconfiguratie.
