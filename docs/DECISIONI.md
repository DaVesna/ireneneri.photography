# Decisioni

Una riga di motivazione per ogni scelta non ovvia.

| Data | Decisione | Motivazione |
|---|---|---|
| 2026-11-07 | Node 26 LTS (`.nvmrc` 26.13.0) | Astro 7.4 richiede Node ≥ 22.23.4; la 26 è la LTS attiva oggi. Confermato da Davide. |
| 2026-11-07 | TypeScript 6.0, non 7 | `@astrojs/check` supporta solo TypeScript 5 e 6. |
| 2026-11-07 | Script delle foto in `.mjs` con JSDoc e `checkJs` | Girano con Node senza passaggio di compilazione, ma restano controllati dai tipi. |
| 2026-11-07 | `.env` letto con `node --env-file-if-exists` | Funzione nativa di Node: una dipendenza in meno (niente dotenv). |
| 2026-11-07 | Tutta `src/photos/` e ogni immagine raster esclusi da git | Le foto e le loro copie non devono mai entrare nel repo, nemmeno per sbaglio. |
| 2026-11-07 | Un album per ogni cartella foglia, senza sezioni interne | Ogni sottocartella è una sessione o un evento con data propria; le sezioni complicherebbero lo Studio a Irene senza una struttura che le richieda. |
| 2026-11-07 | Mika e Piero album separati, non un unico album WTA con sezioni | Sono due soggetti e due sessioni diverse (Piero anche l'11 febbraio); così si rispettano le cartelle di Irene. |
| 2026-11-07 | Titoli col solo nome della persona o del luogo | È il nome della cartella; il contesto (palestra, pole dance) sta nel testo e nella categoria. "Teatro Monfalcone" diventa "Teatro di Monfalcone". |
| 2026-11-07 | Escluse le cartelle matrimonio-anna-e-luca e nina-e-il-prato | Contengono sfocature generate da 18 KB senza EXIF e un meta.json con dati inventati: pubblicarle farebbe passare per foto di Irene immagini finte. |
| 2026-11-07 | Le quattro categorie delle cartelle restano, anche se vuote | Irene fotografa anche persone, animali ed eventi: le categorie servono per i prossimi album; il sito mostra solo quelle con almeno un album. |
| 2026-11-07 | Copia organizzata in backup/album/, la copia grezza già presente resta | Non si cancella nulla che Davide possa aver messo lì come salvataggio. |
| 2026-11-07 | Luogo "WTA" e non il nome completo della palestra | Il nome completo si legge solo nelle foto, non nelle cartelle o nell'EXIF. |
