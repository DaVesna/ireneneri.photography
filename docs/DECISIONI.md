# Decisioni

Una riga di motivazione per ogni scelta non ovvia.

| Data | Decisione | Motivazione |
|---|---|---|
| 2026-11-07 | Node 26 LTS (`.nvmrc` 26.13.0) | Astro 7.4 richiede Node ≥ 22.23.4; la 26 è la LTS attiva oggi. Confermato da Davide. |
| 2026-11-07 | TypeScript 6.0, non 7 | `@astrojs/check` supporta solo TypeScript 5 e 6. |
| 2026-11-07 | Script delle foto in `.mjs` con JSDoc e `checkJs` | Girano con Node senza passaggio di compilazione, ma restano controllati dai tipi. |
| 2026-11-07 | `.env` letto con `node --env-file-if-exists` | Funzione nativa di Node: una dipendenza in meno (niente dotenv). |
| 2026-11-07 | Tutta `src/photos/` e ogni immagine raster esclusi da git | Le foto e le loro copie non devono mai entrare nel repo, nemmeno per sbaglio. |
