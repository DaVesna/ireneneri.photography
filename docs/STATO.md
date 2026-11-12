# Stato dei lavori

Aggiornato dopo ogni sotto-step. Se la sessione riparte da capo, leggere prima la sezione "Riprendere il lavoro" qui sotto, poi `CLAUDE.md` e, se serve, il registro più in basso.

## Riprendere il lavoro (aggiornato il 12 novembre 2026)

### Dove siamo

- **Roadmap M1–M11 completata** il 7 novembre 2026. L'8 novembre Davide ha scartato lo stile della prima versione: il sito è stato **ridisegnato (versione 2)** su nuovi riferimenti, con la firma di Irene, Work Sans e il suo ritratto vero. Direzione visiva attuale: `docs/direzione-visiva.md` (la v1 è in `docs/direzione-visiva-v1.md`).
- **Privacy** fornita da Davide, caricata nel CMS e allineata al sito (variante A: Cloudflare Web Analytics attivo, da accendere al deploy con il token).
- **Codice**: tutto sul branch `sito-v1`, allineato con GitHub, in revisione nella [pull request #1](https://github.com/DaVesna/ireneneri.photography/pull/1) verso `main`. Nessun deploy fatto.
- **Node 26.13.0** è ora la versione predefinita sul PC di Davide.

### Contenuti nel CMS (fotografia del 12 novembre 2026)

- 7 album, tutti Sport: No Border Village, Teatro di Monfalcone, Elisa, Catarina e Alice (rinominato da "Cata e Alice" nello Studio), Mika, Piero, Boxe.
- Categorie: Sport, Persone, Animali, Eventi (solo Sport ha album; la firma di Irene dice "sport, pet, portrait": valutare se rinominare le categorie).
- Home: 4 foto di benvenuto, 3 album in evidenza (Teatro di Monfalcone, Catarina e Alice, No Border Village), frase d'invito.
- Chi sono: ritratto vero di Irene; testo ancora provvisorio con un `[DA FORNIRE]`.
- Contatti: email e Instagram ancora `[DA FORNIRE]` (l'email ireneneri.photography@gmail.com compare già nella privacy).
- Privacy: testo completo (13 sezioni); dominio della sezione 2 da confermare.

### Prossimi passi, in ordine

1. **Davide rivede lo stile v2** (`npm run dev:web` oppure build + anteprima, vedi sotto) e indica le correzioni.
2. **Dominio**: non ancora comprato. Quando c'è, allineare in un colpo solo privacy (sezione 2), `SITO_URL`, CORS di Sanity, widget Turnstile, Web Analytics (elenco in `docs/MANCANTI.md`). Consigliato Cloudflare Registrar.
3. **Contenuti di Irene**: tutto ciò che è in `docs/MANCANTI.md` (email, Instagram, testo di Chi sono, luoghi degli album, foto per Persone/Animali/Eventi, originali ad alta risoluzione di Elisa, firma vettoriale originale).
4. **Deploy** seguendo `docs/deploy.md`: Cloudflare Workers, segreti, Turnstile vero, servizio email (consigliato Email Routing), Web Analytics, Studio pubblicato, invito di Irene come Amministratrice con verifica in due passaggi, aggiornamento automatico del sito con webhook firmato.
5. **Revocare il token di scrittura di Sanity** dopo l'ultimo import.

### Avviare e controllare (PowerShell, dalla radice)

```powershell
npm install
npm run dev:web        # sito in sviluppo: http://localhost:4321
npm run dev:studio     # Studio: http://localhost:3333 (Google oppure email e password di Sanity)
npm test               # 14 test (modulo contatti, header di sicurezza)
npm run typecheck
npm run build:web
cd web; npx astro preview --port 4322; cd ..   # sito come in produzione, con CSP
npm run qualita        # axe, tastiera, reduced-motion, console (contro la porta 4322)
npm run anteprima:compressa                     # build servito con gzip sulla porta 4323
npm run lighthouse -- http://localhost:4323     # misure come in produzione
```

### Note pratiche per chi riprende

- **Foto**: originali in sola lettura in `src/photos/original`; copia di lavoro in `src/photos/backup` (album ordinati in `backup/album/`, ritratto in `backup/ritratto/irene.jpg`); versioni da caricare in `src/photos/preparate/`. Niente di `src/photos/` entra in git. L'impronta dell'originale si verifica con `npm run foto:inventario -- --verifica`.
- **Firma**: sorgente `firma_senza_contatti.png` nella radice (ignorato da git); versioni per il sito, vettorializzate, in `web/src/assets/firma-completa.svg` e `firma-corsivo.svg`.
- **Font**: Work Sans da `@fontsource-variable/work-sans`; lo zip `work_sans.zip` nella radice è solo la fonte della licenza (ignorato da git).
- **Rete instabile su questo PC**: errori DNS momentanei su GitHub, Sanity e npm. Push e build vanno semplicemente ripetuti; le richieste a Sanity del sito hanno già 4 tentativi.
- **Git Bash** converte un argomento `/` in un percorso di Windows: per `npm run lighthouse` con percorsi espliciti usare PowerShell o anteporre `MSYS_NO_PATHCONV=1`.
- **Script di aggiornamento dei contenuti** (privacy, ritratto) sono stati eseguiti una volta con il token: il CMS è la fonte di verità, `foto:importa` non sovrascrive i documenti esistenti.

## Milestone

| Milestone | Stato |
|---|---|
| M1 — Fondamenta del repository | fatta |
| M2 — Ricognizione e copia delle foto | fatta |
| M3 — Direzione visiva | fatta |
| M4 — Modello dei contenuti e Studio | fatta (prova nello Studio da completare con login) |
| M5 — Preparazione immagini e precaricamento | fatta |
| M6 — Fondamenta del sito | fatta |
| M7 — Pagine | fatta |
| M8 — Form contatti | fatta |
| M9 — Sicurezza | fatta |
| M10 — Responsive, accessibilità, prestazioni | fatta |
| M11 — Consegna | fatta |

## Registro

### M1 — Fondamenta del repository (2026-11-07)

- Branch `sito-v1` creato da `main`. Nel repo non c'erano file di tentativi precedenti (solo `CLAUDE.md`, `ROADMAP.md`, `README.md`, `.gitignore`), quindi nessun commit di rimozione.
- Primo commit del branch: `.gitignore` (dipendenze, `.env*` tranne `.env.example`, tutta `src/photos/`, immagini raster, screenshot, temporanei, file di sistema).
- npm workspaces `web`, `studio`, `scripts` con gli script `dev:web`, `dev:studio`, `foto:*`. `web` e `studio` sono segnaposto fino a M6 e M4.
- `.nvmrc` = 26.13.0 (LTS attiva), `engines`, Prettier, `.editorconfig`, `.gitattributes`, `tsconfig.base.json`, `npm run typecheck`.
- `.env.example` senza valori.
- `npm install` dalla radice funziona; `npm run typecheck` e `npm run format:check` passano.

### M2 — Ricognizione e copia delle foto (2026-11-07)

- `foto:inventario`: impronta iniziale in `src/photos/impronta-originale.json` (129 file), inventario in `docs/inventario-foto.md`. Opzione `--verifica` per il confronto finale.
- 83 JPEG nell'originale: 74 foto vere (Nikon D800, con EXIF) e 9 immagini segnaposto sfocate in `events/matrimonio-anna-e-luca` e `pets/nina-e-il-prato`, escluse. 44 file di sistema macOS ignorati.
- Piano in `docs/piano-album.md` e `scripts/dati/album.json`: 7 album, tutti Sport (Mika, Piero, Cata e Alice, Elisa, Teatro di Monfalcone, No Border Village, Boxe).
- `foto:copia`: 74 foto in `src/photos/backup/album/<slug>/<slug>-NN.jpg`, ordine cronologico. Conteggio verificato, SHA-256 identico su 16 foto di campione. La copia grezza già presente in `backup/` (events, people, pets, sport) è lasciata com'era.
- `foto:anteprime`: miniature 400 px e provini in `src/photos/anteprime/`.
- Copertine, 8 foto di benvenuto, 4 album in evidenza e testi degli album scelti e annotati nel piano.
- Controllo finale: originale intatto (129 file identici all'impronta).

### M3 — Direzione visiva (2026-11-07)

- Screenshot dei riferimenti (Playwright per Pedron e Amelia Allen; Zielecki nel browser integrato, perché blocca i browser automatici) in `screenshots/riferimenti/`.
- `docs/direzione-visiva.md`: analisi dei riferimenti, piano in prima passata, revisione critica, piano finale, due giri di correzioni sul prototipo.
- Prototipo statico in `prototipo/` (home e pagina album No Border Village), immagini generate da `prototipo/prepara.mjs` e non versionate. Calcolo delle tinte in `web/src/lib/tinta.js`, riusato dal sito.
- Piano album aggiornato: 7 foto di benvenuto, 3 album in evidenza (Teatro di Monfalcone, Cata e Alice, No Border Village).
- Playwright installato alla radice; `scripts/screenshot.mjs` per gli screenshot alle quattro larghezze.

### M4 — Modello dei contenuti e Studio (2026-11-07)

- Studio Sanity 6.22 in `studio/`, configurato a mano (niente `sanity init` interattivo): progetto `10o0605j`, dataset `production`, titolo "Sito di Irene", interfaccia in italiano con `@sanity/locale-it-it`.
- Schemi: `home`, `album`, `categoria`, `chiSono`, `contatti`, `privacy`, `impostazioni`, più gli oggetti `immagineConAlt`, `fotoAlbum`, `testoSemplice`. Etichette, descrizioni con esempi e messaggi di validazione in italiano semplice.
- Barra laterale: Home, Chi sono, Contatti in cima; poi Album (più recenti in alto) e Categorie; in fondo Privacy e Impostazioni. I documenti singoli hanno ID fisso, non compaiono in "Nuovo" e non hanno elimina, duplica, annulla pubblicazione.
- Immagini: hotspot attivo; metadati solo `lqip` e `palette` (niente EXIF né GPS); nome originale del file non salvato. Avviso (non blocco) sopra i 4000 px, calcolato dalle dimensioni nel riferimento dell'asset.
- Foto degli album in griglia, caricabili trascinandone molte insieme e riordinabili trascinando.
- Vision solo con `NODE_ENV=development`.
- Accesso: solo Google (filtro sui provider). CORS del progetto: solo `http://localhost:3333`.
- Verifiche: `sanity schema validate` 0 errori e 0 avvisi; `sanity build` riuscito; nessun token nel build; schermata di accesso con il solo Google. Prova via API (`scripts/prova-album.mjs`): album di prova con 3 immagini creato, riordinato, eliminato senza residui; la bozza non è visibile senza token.
- **Da completare:** la stessa prova dentro lo Studio, dopo l'accesso con Google di Davide (scelta di Davide: rimandata).

### M5 — Preparazione immagini e precaricamento (2026-11-07)

- `foto:prepara`: 74 foto in `src/photos/preparate/` (lato lungo 3200 px, JPEG 88, sRGB, orientamento applicato, nessun metadato) più il ritratto segnaposto. Verifica su 14 foto: nessun EXIF, GPS, XMP, IPTC, ICC. Peso totale 35,5 MB.
- `foto:importa`: ID deterministici, `--prova` senza scritture, avanzamento a schermo, registro locale per la ripresa, documenti esistenti non toccati (salvo `--sovrascrivi`), caricamento con `preserveFilename: false` ed estrazione dei soli `lqip` e `palette`.
- Eseguiti `--prova` e poi l'import vero: 75 immagini, 16 documenti pubblicati (4 categorie, 7 album, home, chiSono, contatti, privacy, impostazioni). Secondo lancio: 0 caricamenti, 0 documenti scritti. Nel dataset: 75 asset, 0 con EXIF o posizione, 0 bozze. Tre file scaricati dalla CDN: nessun metadato.
- `docs/MANCANTI.md` riscritto con tutti i segnaposto del CMS.

### M6 — Fondamenta del sito (2026-11-07)

- Node 26.13.0 installato con `nvm install` (senza `nvm use`: la versione predefinita del sistema resta la 22 finché Davide non la cambia). I comandi del sito girano con Node 26; `.claude/launch.json` avvia il server di sviluppo con il suo eseguibile.
- Astro 7.4 in `web/` con adapter Cloudflare 14 (`imageService: 'passthrough'`), pagine statiche per default, sitemap, `compressHTML: true`, fogli di stile e script sempre esterni (per la CSP).
- `src/lib/sanity.ts`: unico accesso ai dati, client senza token, `perspective: 'published'`, query GROQ tipizzate, cache per la durata del build; gli album incompleti (senza slug, copertina o data) non vanno in pagina.
- `src/lib/immagini.ts` e `Immagine.astro`: URL trasformati della CDN di Sanity (`w`, `auto=format`, `q=78`, `fit=max`), `srcset` fino a 2560 px sul lato lungo, `sizes` calcolato sulla proporzione, dimensioni esplicite, LQIP come sfondo durante il caricamento, punto focale come `--fx/--fy`.
- Token di design come variabili CSS (`src/styles/globale.css`), font Archivo e Literata da Fontsource serviti dal sito, testata con menu, piede, link "Vai al contenuto".
- Deterrenti sulle immagini come comportamento globale (`src/scripts/protezione.ts` + CSS): niente menu contestuale né trascinamento su foto e visore, niente menu da pressione prolungata su iOS.
- Pagina di prova: la pagina album vera (`/album/<slug>/`) con dati reali, screenshot a 390, 768, 1440, 1920 in `screenshots/m6/`. Peso misurato: copertina a 1600 px 71 KB in AVIF (156 KB in JPEG), foto a 480 px circa 19 KB. `astro check`: 0 errori.
- npm 11 chiede di autorizzare gli script di installazione: autorizzati esbuild e workerd (`allowScripts` nel `package.json` della radice).

### M7 — Pagine (2026-11-07)

- Home: striscia delle foto di benvenuto, presentazione con ritratto, capitoli degli album in evidenza nella tinta della copertina (se Irene non ne sceglie, i tre più recenti), invito a scrivere (nuovo campo `invito` della Home, precaricato).
- Album: elenco a righe raggruppato per anno, dal più recente; filtro per categoria e anno con lo stato nell'URL (`?categoria=…&anno=…`), visibile solo con JavaScript e solo se ha senso (oggi c'è una sola categoria, quindi compare solo l'anno); "Mostra altri" oltre i 12 album; stato vuoto con pulsante per togliere i filtri.
- Pagina album: apertura (copertina verticale accanto al testo, orizzontale a tutta larghezza), data e luogo in frase, link alla categoria, carosello (swipe, frecce, tastiera, contatore), visore a tutto schermo (clic, frecce, Inizio/Fine, Esc, swipe, precaricamento delle vicine, didascalia), vista d'insieme a miniature, link diretto `#foto-N`, album successivo nella sua tinta e precedente.
- Chi sono, Contatti (impaginazione e modulo), Privacy (dal CMS), 404, `robots.txt`, sitemap, titoli e descrizioni dal CMS, Open Graph con immagine ritagliata 1200×630.
- Correzioni dopo gli screenshot: query degli album in evidenza (in GROQ `ref[]->[filtro]` dava `null`), striscia di benvenuto a 768 px (orizzontali inquadrate sul punto focale invece di galleggiare).
- Verifiche: tutte le pagine 200 (404 dove previsto), nessun errore in console, visore provato in automatico, screenshot a 390, 768, 1440, 1920 in `screenshots/m7/`.

### M8 — Form contatti (2026-11-07)

- Campi: nome, email, tipo di richiesta (categorie usate + "Altro"), messaggio, consenso obbligatorio; campo trappola nascosto.
- Unico endpoint server: `/contatti/invia/` (pagina on-demand). Con JavaScript risponde in JSON e gli errori compaiono accanto ai campi; senza JavaScript restituisce la pagina con gli errori e i valori inseriti, o la conferma.
- Logica in moduli puri (`src/lib/contatti/`): validazione con limiti di lunghezza e divieto di caratteri di controllo in nome/email; verifica Turnstile lato server (in produzione senza segreto fallisce sempre); limite di 5 invii ogni 10 minuti per IP (contatore in memoria, binding Rate Limiting di Cloudflare al deploy); messaggi d'errore generici.
- Email dietro l'interfaccia `InvioEmail`: oggi l'invio finto nel log; destinatario e mittente da variabili d'ambiente; Reply-To = email validata; oggetto fisso con il nome ripulito; corpo con caratteri speciali neutralizzati.
- Test: `npm test` (12 test con `node --test`) coprono invio valido, campi non validi, limiti di lunghezza, iniezione di intestazioni, trappola, Turnstile fallito, raffica di invii, metodo/tipo/dimensione, neutralizzazione, errori del servizio email. Prove end-to-end sul server locale: invio JSON (messaggio nel log), invio senza JS con errori (422), trappola (400), GET (303), invio dal browser con il widget di prova; siteverify reale con i segreti di prova ufficiali (OK → true, KO → false).
- Senza JavaScript la verifica Turnstile non può partire: il modulo lo dice e rimanda all'email.

### M9 — Sicurezza (2026-11-07)

- Header e CSP: unica fonte `web/src/lib/intestazioni.js`, servita da `web/public/_headers` (pagine statiche) e dal middleware (risposta del server); test di coerenza. Prova con `astro preview`: header presenti, 0 violazioni CSP su tutte le pagine, immagini, visore e Turnstile funzionanti.
- Ricerca segreti: token assente da build del sito, build dello Studio, file tracciati e intera storia di git; `.env` mai committato.
- Bozze: non leggibili senza token (provato con una bozza vera, poi eliminata).
- CORS: solo `http://localhost:3333`; origini da aggiungere in `docs/deploy.md`.
- `npm audit`: da 20 vulnerabilità (tutte nella CLI di Sanity) a 0, con `overrides` mirati; lockfile rigenerato; verificati Studio (schema, build, CLI), sito (check, build), test.
- `docs/sicurezza.md` con lo stato e l'elenco di cosa fare al deploy.

### M10 — Responsive, accessibilità, prestazioni (2026-11-07)

Strumenti: `npm run qualita` (axe, tastiera, reduced-motion, console) e `npm run lighthouse` contro il build servito da `astro preview` (porta 4322).

**Responsive.** Screenshot di tutte le pagine a 390, 768, 1440, 1920 in `screenshots/m10/`. Difetti trovati e corretti:
- a 768 px le copertine verticali (apertura album e capitoli della home) schiacciavano il testo in una colonna di una parola per riga, e il titolo "Teatro di Monfalcone" andava su tre righe: tra 761 e 1100 px una sola colonna, copertina alta al massimo il 70% dello schermo;
- album con una sola foto (Boxe): la foto compariva due volte, come copertina e nel carosello; ora c'è solo la copertina, che apre il visore.

**Tastiera.** Primo Tab su "Vai al contenuto", focus visibile, menu raggiungibile, carosello con le frecce, visore aperto con Invio e con il focus dentro, frecce nel visore, Esc che chiude e riporta il focus sulla foto, modulo compilabile interamente da tastiera: tutto superato.

**Accessibilità (axe, WCAG 2.2 A/AA).** 0 errori gravi su 9 pagine, a 390 e 1440 px. Il widget Turnstile (iframe di terze parti) è escluso dall'analisi.

**prefers-reduced-motion.** View Transition spenta, scorrimenti immediati, nessuna transizione o animazione (regola globale aggiunta: prima restava la transizione di sfondo delle righe dell'elenco album).

**Console.** Nessun errore su nessuna pagina (a parte il 404 voluto sulla pagina inesistente).

**Lighthouse, modalità mobile (4G simulato).**

| Pagina | Prestazioni | Accessibilità | Buone pratiche | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home | 99 | 100 | 100 | 100 | 2,3 s | 0 | 0 ms |
| Album Teatro di Monfalcone | 99 | 100 | 100 | 100 | 2,1 s | 0 | 0 ms |
| Album Piero (23 foto) | 98 | 100 | 100 | 100 | 2,4 s | 0 | 0 ms |
| Album Boxe | 98 | 100 | 100 | 100 | 2,3 s | 0 | 0 ms |
| Elenco album | 99 | 100 | 100 | 100 | 2,3 s | 0 | 0 ms |

Misure fatte servendo il build con compressione gzip, come farà Cloudflare. Con `astro preview`, che non comprime l'HTML, le pagine album misurano 0,2–0,4 s in più (prestazioni 95–98).

Interventi per arrivarci (prima: home 2,5 s, album 2,7–2,9 s): font ridotti a latino e latino esteso con `preload` (il CSS di Fontsource dichiarava anche cirillico, greco e vietnamita); `preload` della foto principale di ogni pagina; priorità alta solo alla foto principale (le prime foto del carosello competevano con la copertina); CSS diviso per pagina (prima un unico file con 12 KB inutilizzati per pagina); dati del visore compatti; `srcset` a 5 larghezze nelle strisce; prima misura della striscia rimandata al fotogramma successivo (niente reflow forzato). Tentativo scartato: togliere il `preload` dei font peggiorava LCP e introduceva spostamenti del layout.

**Robustezza del build.** Due build su molti sono falliti durante il pre-rendering per errori di rete momentanei (la stessa instabilità DNS vista con GitHub): le richieste a Sanity ora fanno fino a 4 tentativi e un errore non resta in cache; tre build consecutivi riusciti.

### M11 — Consegna (2026-11-07)

- `README.md` completo (requisiti, installazione, avvio di sito e Studio in PowerShell, script delle foto, variabili d'ambiente).
- `docs/guida-irene.md`: accesso, album, foto, copertina e punto focale, pubblicazione, home, Chi sono, esportazione delle foto passo per passo.
- `docs/deploy.md`: Cloudflare Workers, segreti, Turnstile, servizio email, dominio, CORS, deploy dello Studio, aggiornamento del sito (webhook firmato o rendering su richiesta).
- `docs/MANCANTI.md` completo; `docs/REPORT.md` con promemoria sulla revoca del token.
- Controlli finali: originale intatto, `npm audit` 0, controllo dei tipi 0 errori, 14 test superati, build di sito e Studio riusciti, nessun segreto nel build, nel repo e nella storia.

### Rifacimento dello stile — versione 2 (2026-11-08)

Davide ha scartato lo stile della versione 1 e ha indicato nuovi riferimenti (fionanoever.de, agatiandrea.com, codeeritratti.com), la firma di Irene, il font Work Sans e il ritratto vero di Irene.

- Analisi dei riferimenti (anche scorrendo nel browser, perché le animazioni nascondono il contenuto agli screenshot automatici) e nuova direzione in `docs/direzione-visiva.md`; la versione 1 è archiviata in `docs/direzione-visiva-v1.md`.
- Stile chiaro: fondo Carta, testo Inchiostro, fasce e piede Ardesia; Work Sans (Fontsource, solo latino e latino esteso).
- Firma di Irene vettorializzata dal PNG (potrace) in due SVG: completa (apertura, piede) e solo corsivo (testata). Bianca sulle foto con un'inversione CSS.
- Home: apertura a tutto schermo con le foto di benvenuto che si dissolvono (coppie di verticali su schermi larghi, pausa, reduced-motion rispettato, foto successive caricate solo poco prima), ritratto rotondo con presentazione, capitoli "fascia in parallasse + tre foto", fascia scura d'invito.
- Elenco album: mosaico a misure diverse con titolo sulla foto, filtro a schede di testo.
- Pagina album: velatura chiara presa dalla copertina, copertina a tutta larghezza con titolo, galleria a righe giustificate senza ritagli, visore invariato, fascia dell'album successivo.
- Chi sono e Contatti ridisegnati per il fondo chiaro.
- Movimento: entrate morbide e parallasse con animazioni CSS legate allo scorrimento, solo dove supportate, spente con reduced-motion.
- Ritratto vero di Irene: spostato in `src/photos/backup/ritratto/irene.jpg`, preparato senza metadati, caricato e messo in Chi sono con il punto focale sul viso. Gli script `foto:prepara` e `foto:importa` ora lo gestiscono.
- Privacy: nuovo tipo di testo con titoli ed elenchi (`testoStrutturato`) e testo fornito da Davide caricato nel CMS (13 sezioni).
- Il sito legge Sanity senza la cache CDN, così un build fatto subito dopo una pubblicazione vede i dati nuovi.
- Studio: accesso anche con email e password di Sanity.
- Verifiche: `npm run qualita` tutto superato (axe 0 errori gravi, tastiera, reduced-motion, console); Lighthouse mobile con compressione: prestazioni 99–100, accessibilità, buone pratiche e SEO 100, LCP 0,8–2,1 s; 14 test superati; `npm audit` 0.

### Privacy allineata al sito (2026-11-08)

- Proposta in `docs/privacy-proposta.md`; Davide ha scelto la variante A (Cloudflare Web Analytics attivo).
- Nello Studio: sezione 3 (niente più "nessun modulo"), sezione 6 (paragrafo su Turnstile), sezione 10 (modulo di contatto ed email). Riga del dominio invariata, da confermare.
- Sito: CSP con lo script delle statistiche e l'invio a `cloudflareinsights.com`; script inserito solo con `PUBLIC_CF_WEB_ANALYTICS_TOKEN` al build; casella del modulo diventata "Ho letto l'informativa privacy".

## Azioni richieste a Davide

- Rivedere lo stile v2 e indicare le correzioni.
- Comprare il dominio (poi allineamento, vedi "Prossimi passi").
- Entrare nello Studio (`npm run dev:studio`, http://localhost:3333, con email e password di Sanity o con Google) e provare a creare, riordinare ed eliminare un album di prova con 3 foto: è l'unica verifica della M4 rimasta da fare a mano.
- Revocare il token di scrittura di Sanity quando non servono più import.
