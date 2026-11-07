# Stato dei lavori

Aggiornato dopo ogni sotto-step. Se la sessione riparte da capo, leggere questo file e `ROADMAP.md` prima di continuare.

## Milestone

| Milestone | Stato |
|---|---|
| M1 — Fondamenta del repository | fatta |
| M2 — Ricognizione e copia delle foto | fatta |
| M3 — Direzione visiva | fatta |
| M4 — Modello dei contenuti e Studio | da fare |
| M5 — Preparazione immagini e precaricamento | da fare |
| M6 — Fondamenta del sito | da fare |
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

## Prossimo passo

M4.1 — inizializzare lo Studio in `/studio`.

## Azioni richieste a Davide

- Installare e attivare Node 26 LTS (PowerShell da amministratore): `nvm install 26.13.0` poi `nvm use 26.13.0`. Astro 7 non gira sulla 22.23.2 installata.
