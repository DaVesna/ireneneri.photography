# Stato dei lavori

Aggiornato dopo ogni sotto-step. Se la sessione riparte da capo, leggere questo file e `ROADMAP.md` prima di continuare.

## Milestone

| Milestone | Stato |
|---|---|
| M1 — Fondamenta del repository | fatta |
| M2 — Ricognizione e copia delle foto | da fare |
| M3 — Direzione visiva | da fare |
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

## Prossimo passo

M2.1 — script `foto:inventario` in sola lettura sull'originale, con impronta iniziale.

## Azioni richieste a Davide

- Installare e attivare Node 26 LTS (PowerShell da amministratore): `nvm install 26.13.0` poi `nvm use 26.13.0`. Astro 7 non gira sulla 22.23.2 installata.
