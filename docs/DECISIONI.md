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
| 2026-11-07 | Fondo scuro caldo (Carbone #1c1a18), mai nero puro | Regge sia le foto di palco buie sia quelle di studio chiare; è l'opposto dei fondi bianchi scartati. |
| 2026-11-07 | Nessun colore d'accento fisso | Il colore della pagina è la tinta della copertina; un accento fisso (ottone) rischiava il "lusso di default". |
| 2026-11-07 | Tinta = colore più saturo della copertina, L 0,25, croma ≤ 0,07, contrasto ≥ 7:1 | Con darkMuted le tinte uscivano grigie e indistinguibili. Calcolo in `web/src/lib/tinta.js`. |
| 2026-11-07 | Archivo (stretto per i titoli) + Literata (prosa), da Fontsource in locale | Due famiglie lontane per forma e funzione; licenza OFL; nessuna richiesta a Google Fonts. |
| 2026-11-07 | Striscia orizzontale ad altezza fissa per benvenuto e carosello | Mostra insieme foto verticali e orizzontali senza ritagli e dà un solo modo di guardare in tutto il sito. |
| 2026-11-07 | Unico movimento: View Transition tra capitolo/elenco e pagina album | Movimento con un significato (la copertina diventa l'apertura); nativo del browser; spento con reduced-motion. |
| 2026-11-07 | Menu sempre visibile anche su mobile (tre voci), niente hamburger | Tre voci stanno in 390 px; un menu nascosto è un passaggio in più. |
| 2026-11-07 | Su mobile le orizzontali della striscia di benvenuto si inquadrano in 4:5 sul punto focale | Altrimenti restano piccole in un riquadro vuoto; il ritaglio usa l'hotspot scelto da Irene. |
| 2026-11-07 | Foto di benvenuto diverse dalle copertine degli album in evidenza; 3 album in evidenza | Evita di mostrare la stessa foto due volte nella home. |
| 2026-11-07 | Frase di benvenuto lasciata vuota | Nel prototipo ripeteva la presentazione; è l'elemento tolto in chiusura della M3. |
| 2026-11-07 | Studio configurato a mano, non con `sanity init` | L'init è interattivo e avrebbe creato file di esempio; la configurazione a mano resta minima e leggibile. |
| 2026-11-07 | Documento singolo `privacy` nel CMS | La regola è che tutti i contenuti si modificano dal CMS, informativa compresa. |
| 2026-11-07 | Campo `presentazioneBreve` in Chi sono | La home mostra ritratto e due frasi di Irene; tenerle nello stesso documento del ritratto evita doppioni. |
| 2026-11-07 | Avviso foto grandi calcolato dal riferimento dell'asset | Sanity scrive le dimensioni nell'ID (`image-…-4000x6000-jpg`): niente richieste in più e funziona subito dopo il caricamento. |
| 2026-11-07 | Icone importate dai sottopercorsi di `@sanity/icons` | Dalla versione 5 la radice del pacchetto non esporta più le singole icone. |
| 2026-11-07 | Nessuna origine CORS per il sito | Il sito legge Sanity solo dal server durante il build; nel browser non parte nessuna richiesta a Sanity. |
| 2026-11-07 | L'import non sovrascrive i documenti esistenti (salvo `--sovrascrivi`) | Rilanciarlo per sbaglio dopo che Irene ha modificato qualcosa non deve cancellare il suo lavoro. |
| 2026-11-07 | Documenti precaricati già pubblicati | Il sito legge solo contenuti pubblicati; Irene li trova pronti e li corregge. |
| 2026-11-07 | JPEG 88 con mozjpeg e croma 4:4:4 | Qualità alta per i dettagli colorati (luci di scena); il peso resta basso (35,5 MB in tutto). |
| 2026-11-07 | Presentazione breve basata solo sui fatti degli album | Non si inventa nulla su come lavora Irene: quella parte resta `[DA FORNIRE]` nel testo di Chi sono. |
| 2026-11-07 | Email e Instagram precaricati come `[DA FORNIRE: …]` | Regola dei segnaposto; lo Studio segnalerà il formato non valido finché Irene non li corregge, e il sito li mostra come testo. |
