# Stato dei lavori

Aggiornato dopo ogni sotto-step. Se la sessione riparte da capo, leggere questo file e `ROADMAP.md` prima di continuare.

## Milestone

| Milestone | Stato |
|---|---|
| M1 — Fondamenta del repository | fatta |
| M2 — Ricognizione e copia delle foto | fatta |
| M3 — Direzione visiva | fatta |
| M4 — Modello dei contenuti e Studio | fatta (prova nello Studio da completare con login) |
| M5 — Preparazione immagini e precaricamento | fatta |
| M6 — Fondamenta del sito | fatta |
| M7 — Pagine | da fare |
| M8 — Form contatti | da fare |
| M9 — Sicurezza | da fare |
| M10 — Responsive, accessibilità, prestazioni | da fare |
| M11 — Consegna | da fare |

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

## Prossimo passo

M7 — pagine: home, elenco album, Chi sono, Contatti (impaginazione), Privacy, 404, SEO.

## Azioni richieste a Davide

- Entrare nello Studio (`npm run dev:studio`, poi http://localhost:3333, accesso con Google) e provare a creare, riordinare ed eliminare un album di prova con 3 foto.

- Rendere Node 26 la versione predefinita (PowerShell da amministratore): `nvm use 26.13.0`. È già installata.
