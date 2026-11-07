# Sito di Irene Neri

Sito portfolio di Irene Neri, fotografa. Il repository contiene:

- `web/` — il sito pubblico (Astro)
- `studio/` — il CMS (Sanity Studio)
- `scripts/` — script per inventario, copia, anteprime, preparazione e import delle foto
- `docs/` — stato dei lavori, decisioni, dati mancanti, guide

## Requisiti

- Node 26 LTS, gestito con nvm-windows (la versione esatta è in `.nvmrc`)
- un file `.env` nella radice, creato a partire da `.env.example`

## Avvio (PowerShell)

```powershell
nvm use 26.13.0
npm install
Copy-Item .env.example .env   # solo la prima volta, poi compila i valori
npm run dev:web               # sito
npm run dev:studio            # Studio
```

Le istruzioni complete arrivano con la consegna (M11).
