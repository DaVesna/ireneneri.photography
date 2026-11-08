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
| 2026-11-07 | Node 26 installato con nvm ma non attivato dalla sessione | `nvm use` cambia il collegamento di sistema e richiede l'amministratore: lo fa Davide. Concordato con Davide. |
| 2026-11-07 | Nessun servizio immagini di Astro (`passthrough`) | Le trasformazioni le fa la CDN di Sanity; il binding Cloudflare Images non serve. |
| 2026-11-07 | `fit=max` e solo larghezza negli URL, nessun ritaglio lato CDN | Le foto restano alla loro proporzione; il ritaglio, dove serve, è CSS sul punto focale. |
| 2026-11-07 | Qualità 78 con `auto=format` | AVIF/WebP a 78 restano nitidi a schermo e pesano la metà del JPEG. |
| 2026-11-07 | Tinta da `darkVibrant`, poi `vibrant`, poi `dominant` della palette Sanity | Stessa regola del prototipo; i risultati coincidono a occhio con quelli calcolati in M3. |
| 2026-11-07 | Apostrofi dritti trasformati in tipografici al momento della pubblicazione | Irene scriverà con la tastiera normale; il sito sistema la tipografia da solo. |
| 2026-11-07 | `allowScripts` per esbuild e workerd | npm 11 blocca gli script d'installazione; questi due verificano i binari di piattaforma e servono a un'installazione pulita. |
| 2026-11-07 | Frase d'invito della home come campo del CMS | È contenuto, non un'etichetta d'interfaccia. |
| 2026-11-07 | Elenco album a righe, non a card | Evita le card tutte uguali; la riga prende la tinta dell'album al passaggio. |
| 2026-11-07 | Filtri visibili solo con JavaScript e solo se c'è più di un'opzione | Senza JavaScript si vedono tutti gli album; un filtro con una sola voce non serve. |
| 2026-11-07 | Il visore aggiorna l'indirizzo con `#foto-N` | Ogni foto ha un link condivisibile; chiudendo il visore l'indirizzo torna pulito. |
| 2026-11-07 | Endpoint del modulo come pagina Astro on-demand | Così, senza JavaScript, il server può restituire la pagina con errori e valori inseriti. |
| 2026-11-07 | Logica del modulo in funzioni pure con dipendenze iniettate | Testabile con `node --test` senza rete né Cloudflare; il servizio email reale si aggiunge senza toccare il resto. |
| 2026-11-07 | Trappola compilata → risposta 400 generica | Il bot non riceve indizi su quale controllo è scattato. |
| 2026-11-07 | Limite 5 invii / 10 minuti per IP | Abbastanza per chi scrive davvero, troppo poco per una raffica. |
| 2026-11-07 | Test con il runner di Node, senza Vitest | Una dipendenza in meno; Node 26 esegue TypeScript direttamente. |
| 2026-11-07 | `style-src-attr 'unsafe-inline'`, nessun `unsafe-inline` per script e fogli di stile | Le variabili CSS per tinta, proporzioni e punto focale stanno negli attributi `style`; è il compromesso più stretto possibile. |
| 2026-11-07 | Header in un modulo unico + `_headers` controllato da un test | Pagine statiche e risposta del server devono avere gli stessi header; il test impedisce che divergano. |
| 2026-11-07 | `overrides` mirati invece di `npm audit fix --force` | Il fix automatico riportava Sanity a una versione vecchia; gli override correggono solo le librerie vulnerabili. |
| 2026-11-07 | minimatch 11 forzato per la CLI di Sanity | Unico override con salto di versione principale; riguarda solo la riga di comando ed è stato verificato. |
| 2026-11-07 | Font solo latino e latino esteso, con `preload` | Sito solo in italiano; il resto dei caratteri pesava e bloccava il rendering. |
| 2026-11-07 | CSS diviso per pagina | Ogni pagina scarica solo le proprie regole; LCP più basso. |
| 2026-11-07 | Priorità alta solo alla foto principale della pagina | Più foto ad alta priorità si rubano la banda a vicenda. |
| 2026-11-07 | Album con una sola foto uguale alla copertina: niente carosello | Evita la stessa foto ripetuta; la copertina apre il visore. |
| 2026-11-07 | Tra 761 e 1100 px apertura e capitoli su una colonna | Sui tablet in verticale la copertina verticale lasciava al testo una colonna troppo stretta. |
| 2026-11-07 | Richieste a Sanity con 4 tentativi | Un errore di rete momentaneo non deve far fallire il build. |
| 2026-11-08 | Accesso allo Studio anche con email + password di Sanity | Davide ha l'account Sanity con email e password; restano esclusi gli altri metodi (GitHub). |
| 2026-11-08 | Stile v2 chiaro (Carta/Inchiostro/Ardesia) al posto del fondo scuro | Scelta di Davide sui nuovi riferimenti; la firma nera di Irene sta naturalmente su fondo chiaro. |
| 2026-11-08 | Work Sans da Fontsource invece dei TTF dello zip | Stesso carattere (licenza OFL verificata nello zip), già in woff2 e diviso per alfabeti. |
| 2026-11-08 | Firma vettorializzata con potrace | Il PNG era largo 374 px: sgranato nell'apertura (Lighthouse lo segnalava). L'SVG è fedele e nitido a ogni dimensione; resta preferibile l'originale vettoriale di Irene. |
| 2026-11-08 | Entrate morbide e parallasse, in deroga a "un solo movimento" | Davide ha scelto come riferimento un sito animato chiedendo di prenderne spunto; tutte della stessa famiglia, lente, una volta, spente con reduced-motion. |
| 2026-11-08 | Animazioni legate allo scorrimento in CSS (`animation-timeline: view()`) | Nessun JavaScript e nessun contenuto nascosto dove il browser non le supporta. |
| 2026-11-08 | Apertura: coppie di foto verticali su schermi larghi | Una verticale da sola a tutto schermo largo perderebbe gran parte della foto. |
| 2026-11-08 | Galleria a righe giustificate al posto del carosello | Tutte le foto visibili alla loro proporzione, senza ritagli, in stile mosaico. |
| 2026-11-08 | Velatura chiara dalla copertina al posto della tinta scura | Mantiene "ogni album ha il suo tono" dentro lo stile chiaro. |
| 2026-11-08 | Tipo `testoStrutturato` (titoli ed elenchi) solo per la privacy | Il testo legale ha sezioni ed elenchi; gli altri testi restano semplici per Irene. |
| 2026-11-08 | Lettura di Sanity senza CDN | Dopo una pubblicazione la cache CDN può restituire per qualche istante i dati vecchi: il build deve vedere i nuovi. |
| 2026-11-08 | Ritratto in `src/photos/backup/ritratto/` | È una foto: va nella copia di lavoro esclusa da git, non nell'originale in sola lettura né nel repository. |
| 2026-11-08 | Cloudflare Web Analytics con snippet manuale e token al build | Più prevedibile dell'iniezione automatica; senza token nessuno script. Scelta di Davide (variante A). |
| 2026-11-08 | CSP: autorizzato solo `beacon.min.js`, non tutto il dominio delle statistiche | È l'unico file che serve; la CSP resta il più stretta possibile. |
| 2026-11-08 | Casella del modulo come presa visione dell'informativa, non consenso | La base giuridica dichiarata per le richieste di contatto è il legittimo interesse o le misure precontrattuali, non il consenso. |
