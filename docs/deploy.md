# Deploy

**Solo istruzioni: in questa fase non è stato eseguito nessun deploy.** Comandi in PowerShell, dalla radice del repository salvo diversa indicazione. Prima di ogni deploy: `npm test`, `npm run build:web` e la ricerca dei segreti descritta in `docs/sicurezza.md`.

## 1. Sito su Cloudflare Workers

Il sito è un Worker con risorse statiche: le pagine sono file pre-renderizzati serviti dalla piattaforma (con gli header di `web/public/_headers`), e il Worker risponde solo a `/contatti/invia/` e alle pagine inesistenti (404). `astro build` genera la configurazione di deploy in `web/dist/server/wrangler.json` partendo da `web/wrangler.jsonc`.

### Prima volta

```powershell
cd web
npx wrangler login                 # apre il browser per l'accesso a Cloudflare
```

1. **Binding Rate Limiting** per il limite di invii del modulo: aggiungere a `web/wrangler.jsonc`

   ```jsonc
   "ratelimits": [
     { "name": "LIMITE_CONTATTI", "namespace_id": "1001", "simple": { "limit": 5, "period": 60 } }
   ]
   ```

   (il binding conta su finestre di 10 o 60 secondi; 5 invii al minuto per IP, insieme al limite in memoria, bastano. Verificare la sintassi sulla documentazione Cloudflare attuale.)

2. **Segreti** (mai in file):

   ```powershell
   npx wrangler secret put TURNSTILE_SECRET_KEY
   npx wrangler secret put CONTATTI_DESTINATARIO
   npx wrangler secret put CONTATTI_MITTENTE
   ```

3. **Sessioni**: l'adapter Cloudflare dichiara un binding KV `SESSION` anche se il sito non usa sessioni. Al primo deploy Wrangler lo crea da solo; se si preferisce evitarlo, valutare la configurazione `session` di Astro.

### Ogni deploy

```powershell
$env:SITO_URL = "https://ireneneri.photography"          # dominio definitivo
$env:PUBLIC_TURNSTILE_SITE_KEY = "<chiave pubblica Turnstile>"
npm run build:web
cd web
npx wrangler deploy --config dist/server/wrangler.json
cd ..
```

Controlli dopo il deploy: home, una pagina album, invio del modulo (deve arrivare l'email), header con securityheaders.com, `https://<dominio>/robots.txt` e `/sitemap-index.xml`.

## 2. Turnstile e servizio email

### Turnstile

1. Dashboard Cloudflare → **Turnstile** → **Aggiungi widget**: nome "Sito Irene", dominio definitivo (e `www.`), modalità **Gestita**.
2. Copiare la **chiave del sito** in `PUBLIC_TURNSTILE_SITE_KEY` (al build) e la **chiave segreta** con `wrangler secret put TURNSTILE_SECRET_KEY`.
3. In produzione, senza segreto, la verifica fallisce sempre: il modulo non funziona finché il segreto non è impostato (scelta voluta, mai la chiave di prova in produzione).

### Servizio email

Il codice invia le email attraverso l'interfaccia `InvioEmail` (`web/src/lib/contatti/email.ts`); oggi l'unica implementazione è l'invio finto nel log. Per collegare un servizio vero si aggiunge una nuova implementazione e la si usa in `web/src/pages/contatti/invia.astro` al posto di `invioLog()`. Il resto (validazione, oggetto, Reply-To, neutralizzazione) non cambia.

Opzioni:

| Servizio | Pro | Contro |
|---|---|---|
| **Cloudflare Email Routing** (binding `send_email`) | gratuito, nessuna chiave esterna, resta tutto su Cloudflare | invia solo a indirizzi verificati (va benissimo: il destinatario è Irene); richiede il dominio su Cloudflare con Email Routing attivo |
| Resend / Postmark / simili (API HTTP) | semplici, buona consegna | un altro account e una chiave API da custodire come segreto |

Consigliato: Cloudflare Email Routing. Passi: attivare Email Routing sul dominio, verificare l'indirizzo di Irene, aggiungere a `wrangler.jsonc` il binding `"send_email": [{ "name": "EMAIL", "destination_address": "<indirizzo di Irene>" }]`, scrivere l'implementazione `InvioEmail` che compone il messaggio MIME e chiama `env.EMAIL.send(...)`. Il mittente (`CONTATTI_MITTENTE`) deve essere un indirizzo del dominio.

## 3. Dominio, CORS, Studio

### Dominio

1. Dominio su Cloudflare (DNS gestito da Cloudflare).
2. Worker → **Impostazioni** → **Domini e route** → aggiungere il dominio personalizzato (e `www.` con reindirizzamento).
3. Aggiornare `SITO_URL` e rifare il build (sitemap e link canonici usano questo valore).

### Pubblicare lo Studio

```powershell
cd studio
npx sanity deploy            # chiede il nome: diventa https://<nome>.sanity.studio
cd ..
```

Poi:

1. **Origini CORS** (sanity.io/manage → progetto → API → CORS origins, oppure da `studio`):

   | Origine | Credenziali | Perché |
   |---|---|---|
   | `https://<nome>.sanity.studio` | sì | lo Studio pubblicato (di solito Sanity la aggiunge da solo) |
   | `http://localhost:3333` | sì | già presente: lo Studio in locale per lo sviluppo |
   | dominio del sito | no | **non serve** finché il sito legge i dati solo durante il build; aggiungerla solo se si passa al rendering su richiesta con richieste dal browser |

   ```powershell
   cd studio
   npx sanity cors add https://<nome>.sanity.studio --credentials
   ```

2. **Invitare Irene** (sanity.io/manage → Members → Invite) come **Amministratrice** (il piano gratuito non ha ruoli intermedi). Prima dell'invito, la verifica in due passaggi sul suo account Google deve essere attiva.
3. Scrivere l'indirizzo dello Studio in fondo a `docs/guida-irene.md` e togliere la riga da `docs/MANCANTI.md`.

### Pulizia di fine precaricamento

- Revocare il token di scrittura usato per l'import (sanity.io/manage → API → Tokens) e svuotare `SANITY_WRITE_TOKEN` nel `.env`.

## 4. Aggiornare il sito quando Irene pubblica

Le pagine sono statiche: ciò che Irene pubblica nello Studio compare sul sito solo dopo un nuovo build. Due strade:

### A. Ricostruzione automatica con webhook firmato (consigliata)

Sanity chiama un webhook a ogni pubblicazione; il webhook avvia build e deploy.

1. Su GitHub: workflow (`.github/workflows/deploy.yml`) che parte su `repository_dispatch` (e a mano), esegue `npm ci`, `npm run build:web`, `npx wrangler deploy --config dist/server/wrangler.json`, con i segreti `CLOUDFLARE_API_TOKEN` (permesso solo "Workers Scripts: Edit"), `PUBLIC_TURNSTILE_SITE_KEY`, `SITO_URL` nei segreti del repository.
2. Sanity non può chiamare direttamente l'API di GitHub con la firma richiesta: serve un piccolo Worker "ponte" che riceve il webhook di Sanity, **verifica la firma** (intestazione `sanity-webhook-signature`, segreto condiviso impostato nel webhook), e solo allora chiama `repository_dispatch` con un token GitHub con permessi minimi. In alternativa, se disponibile, un "deploy hook" di Cloudflare Workers Builds collegato al repository.
3. Webhook su sanity.io/manage → API → Webhooks: dataset `production`, filtro `!(_id in path("drafts.**"))`, eventi create/update/delete, segreto.
4. Raggruppare pubblicazioni ravvicinate: nel workflow, `concurrency` con `cancel-in-progress: true`.

| Pro | Contro |
|---|---|
| il sito resta statico: veloce, economico, nessuna richiesta a Sanity a ogni visita | le modifiche compaiono dopo 1–3 minuti (tempo del build) |
| nessun carico sulle quote API di Sanity | un pezzo in più da mantenere (workflow + ponte) e due token da custodire |
| CSP e header restano quelli già verificati | un build fallito lascia online la versione precedente (bisogna accorgersene) |

### B. Rendering su richiesta

`output: 'server'` (o pagine con `prerender = false`): il Worker legge Sanity a ogni richiesta, con una cache (Cache API o `Cache-Control` con `stale-while-revalidate`).

| Pro | Contro |
|---|---|
| le modifiche sono visibili subito (o dopo la durata della cache) | ogni visita (fuori cache) fa richieste a Sanity: quote del piano gratuito, latenza in più, sito offline se Sanity non risponde |
| nessun build da avviare | più lavoro per il Worker (tempo di CPU, limiti del piano), cache da progettare |
| | gli header di sicurezza vanno applicati dal middleware a tutte le pagine; da rivalutare la CSP |

Per un portfolio aggiornato qualche volta al mese, **A** è la scelta più semplice e solida.
