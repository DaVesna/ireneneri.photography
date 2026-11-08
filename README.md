# Sito di Irene Neri

Sito portfolio di Irene Neri, fotografa. Il repository contiene tre parti che lavorano insieme:

| Cartella | Cosa contiene |
|---|---|
| `web/` | il sito pubblico (Astro, pagine statiche + un endpoint server per il modulo contatti, pensato per Cloudflare Workers) |
| `studio/` | il CMS (Sanity Studio): qui Irene modifica album, foto e testi |
| `scripts/` | script per le foto (inventario, copia, anteprime, preparazione, import su Sanity) e per i controlli di qualità |
| `docs/` | stato dei lavori, decisioni, dati mancanti, sicurezza, deploy, guida per Irene, report |

I contenuti (album, foto, testi) stanno su Sanity, progetto `10o0605j`, dataset `production`. Le foto non sono nel repository.

## Requisiti

- **Node 26 LTS** gestito con nvm-windows (versione esatta in `.nvmrc`: 26.13.0). Astro 7 non parte con versioni precedenti alla 22.23.4.
- Un account Sanity con accesso al progetto (per lo Studio).
- Un file `.env` nella radice (vedi sotto). Serve solo per gli script delle foto; sito e Studio funzionano anche senza.

## Installazione (PowerShell)

```powershell
# Node 26: la prima volta va installato e attivato da PowerShell come amministratore
nvm install 26.13.0
nvm use 26.13.0
node -v          # deve rispondere v26.13.0

# Dalla cartella del repository
npm install
Copy-Item .env.example .env                 # poi compila i valori (vedi "Variabili d'ambiente")
Copy-Item .env.example web\.dev.vars        # tieni solo le righe del modulo contatti (vedi sotto)
```

`npm install` usa gli `overrides` e l'elenco `allowScripts` del `package.json` della radice: non vanno tolti (vedi `docs/sicurezza.md`).

## Avviare il sito e lo Studio

```powershell
npm run dev:web       # sito su http://localhost:4321
npm run dev:studio    # Studio su http://localhost:3333 (accesso con Google)
```

Il sito legge i contenuti pubblicati su Sanity: ciò che Irene pubblica nello Studio compare nel sito in sviluppo ricaricando la pagina. Nel sito pubblicato, invece, compare solo dopo un nuovo build (vedi `docs/deploy.md`).

Per vedere il sito esattamente come sarà in produzione (con header di sicurezza e CSP attivi):

```powershell
npm run build:web
cd web; npx astro preview --port 4322; cd ..
```

## Comandi utili

| Comando | Cosa fa |
|---|---|
| `npm run dev:web` / `npm run dev:studio` | avvia sito / Studio in sviluppo |
| `npm run build:web` / `npm run build:studio` | build del sito (`web/dist`) / dello Studio (`studio/dist`) |
| `npm test` | test automatici (modulo contatti, header di sicurezza) |
| `npm run typecheck` | controllo dei tipi di sito, Studio e script |
| `npm run format` | formatta il codice con Prettier |
| `npm run qualita` | accessibilità (axe), tastiera, reduced-motion, console sul sito avviato con `astro preview` sulla porta 4322 |
| `npm run lighthouse` | Lighthouse mobile su home e una pagina album (stesso server sulla porta 4322) |

## Script delle foto

Lavorano su due cartelle (modificabili nel `.env`):

- `src/photos/original` — le foto originali, **in sola lettura**: gli script non scrivono mai lì dentro;
- `src/photos/backup` — la copia di lavoro.

Tutta `src/photos/` è esclusa da git.

| Comando | Cosa fa |
|---|---|
| `npm run foto:inventario` | inventario dell'originale in `docs/inventario-foto.md` e impronta iniziale (conteggio e date) |
| `npm run foto:inventario -- --verifica` | controlla che l'originale sia identico all'impronta iniziale |
| `npm run foto:copia` | copia le foto in `src/photos/backup/album/<slug>/` secondo `scripts/dati/album.json`, in ordine di scatto, e verifica la copia |
| `npm run foto:anteprime` | miniature e provini a griglia in `src/photos/anteprime/` |
| `npm run foto:prepara` | versioni da caricare in `src/photos/preparate/` (3200 px, JPEG 88, sRGB, senza metadati) e peso totale |
| `npm run foto:importa -- --prova` | mostra cosa caricherebbe su Sanity, senza scrivere |
| `npm run foto:importa` | carica foto e documenti su Sanity (rilanciabile, non tocca i documenti già esistenti) |
| `npm run foto:importa -- --sovrascrivi` | come sopra, ma ricrea anche i documenti esistenti (cancella le modifiche fatte nello Studio) |

Il piano degli album (cartelle → album, titoli, copertine, testi) è in `scripts/dati/album.json` e spiegato in `docs/piano-album.md`. Gli script servono per il primo caricamento: dopo, Irene aggiunge gli album direttamente dallo Studio (vedi `docs/guida-irene.md`).

## Variabili d'ambiente

Il modello senza valori è `.env.example`. **Nessun file con valori entra in git.**

| Variabile | Dove | Serve a |
|---|---|---|
| `SANITY_PROJECT_ID`, `SANITY_DATASET` | `.env` | script delle foto |
| `SANITY_WRITE_TOKEN` | `.env` | solo `foto:importa` e `scripts/prova-album.mjs`. Da revocare quando non serve più |
| `FOTO_ORIGINALI`, `FOTO_LAVORO` | `.env` (facoltative) | cartelle delle foto, se diverse da quelle predefinite |
| `TURNSTILE_SECRET_KEY` | `web/.dev.vars` in locale, segreto Cloudflare al deploy | verifica anti-spam del modulo. In locale: chiave di prova ufficiale `1x0000000000000000000000000000000AA` |
| `CONTATTI_DESTINATARIO`, `CONTATTI_MITTENTE` | `web/.dev.vars` in locale, Cloudflare al deploy | chi riceve i messaggi del modulo e il mittente dell'email |
| `PUBLIC_TURNSTILE_SITE_KEY` | ambiente del build | chiave pubblica Turnstile (vuota = chiave di prova) |
| `SITO_URL` | ambiente del build | dominio per sitemap e link canonici (vuota = `https://ireneneri.photography`) |
| `PUBLIC_CF_WEB_ANALYTICS_TOKEN` | ambiente del build | token di Cloudflare Web Analytics; vuota = nessuno script di statistiche |

In locale il modulo contatti non invia email: scrive il messaggio nel log del server di sviluppo.

## Documentazione

- `docs/guida-irene.md` — guida all'uso dello Studio per Irene
- `docs/deploy.md` — come pubblicare sito e Studio (istruzioni, nessun deploy eseguito)
- `docs/sicurezza.md` — cosa è protetto e come è stato verificato
- `docs/MANCANTI.md` — dati ancora da fornire
- `docs/REPORT.md` — riepilogo del lavoro, problemi aperti, suggerimenti
- `docs/STATO.md`, `docs/DECISIONI.md` — cronologia e motivazioni
- `docs/direzione-visiva.md` — scelte di design
