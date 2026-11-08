# Sicurezza

Stato verificato il 2026-11-07 (M9). Per ogni punto: cosa è fatto, come è stato verificato, cosa resta da fare al deploy.

## Riepilogo

| Area | Stato | Verifica |
|---|---|---|
| Header di sicurezza e CSP | fatto | `astro preview` (stessa gestione di `_headers` di Cloudflare): header presenti su pagine statiche e risposta del server; 0 violazioni CSP su tutte le pagine, Turnstile compreso |
| Segreti nel build, nel repo, nella storia | nessuno | ricerca del token esatto e di schemi generici: 0 risultati |
| Bozze leggibili senza token | no | bozza di prova creata e cercata senza token in tutte le prospettive: 0 risultati |
| CORS di Sanity | solo `http://localhost:3333` | `sanity cors list` |
| Accesso allo Studio | Google ed email + password di Sanity, solo membri invitati | schermata di accesso con i due soli metodi |
| Modulo contatti | protetto | 12 test automatici + prove end-to-end (vedi M8 in `STATO.md`) |
| `npm audit` | 0 vulnerabilità | `npm audit` alla radice (copre tutti i workspace) |

## Header e Content-Security-Policy

Unica fonte: `web/src/lib/intestazioni.js`. Le pagine statiche li ricevono da `web/public/_headers`, la risposta del server (`/contatti/invia/`) dal middleware `web/src/middleware.ts`. Un test (`intestazioni.test.ts`) fallisce se i due elenchi divergono.

```
Content-Security-Policy:
  default-src 'self'
  script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com/beacon.min.js
  style-src 'self'; style-src-elem 'self'; style-src-attr 'unsafe-inline'
  img-src 'self' https://cdn.sanity.io data:
  font-src 'self'
  connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com
  frame-src https://challenges.cloudflare.com
  frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
  manifest-src 'self'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Scelte:

- **Nessuno script in linea.** Astro è configurato per emettere script e fogli di stile sempre come file (`assetsInlineLimit: 0`, `inlineStylesheets: 'never'`). Controllo sul build: 0 `<script>` eseguibili in linea, 0 `<style>`, 0 attributi `on…`. Gli unici `<script>` senza `src` sono blocchi `type="application/json"` (dati del visore), che il browser non esegue.
- **`style-src-attr 'unsafe-inline'`**: serve per gli attributi `style` con le variabili CSS (tinta dell'album, proporzioni, punto focale, anteprima LQIP). Consente solo attributi su elementi già presenti, non fogli di stile né `<style>`; i valori sono calcolati dal sito, non scritti da utenti.
- **Statistiche Cloudflare**: autorizzato solo il file `beacon.min.js` (non tutto il dominio) e l'invio dei dati a `cloudflareinsights.com`. Lo script si carica solo se al build è impostato `PUBLIC_CF_WEB_ANALYTICS_TOKEN`.
- **`data:` nelle immagini**: le anteprime sfocate (LQIP) di Sanity sono URI `data:`.
- **`frame-ancestors 'none'` e `X-Frame-Options: DENY`**: il sito non si può incorporare in altre pagine.

## Segreti

- Token e segreti solo in `.env` (radice) e `web/.dev.vars` (sviluppo locale), entrambi esclusi da git. `.env.example` è senza valori.
- Il sito non usa token: il client Sanity è in sola lettura, `perspective: 'published'`.
- Ricerche eseguite (tutte con 0 risultati):
  - valore esatto del token di scrittura in `web/dist`, `studio/dist`, file tracciati, `git log --all -p`;
  - `.env` e `web/.dev.vars` in qualunque commit;
  - schemi generici (`sk…` lunghi, `*_TOKEN=valore`, `secret_key=…`): gli unici riscontri sono hash `integrity` di `package-lock.json` e sequenze dentro le anteprime LQIP in base64.
- Nota: il build copia `web/.dev.vars` in `web/dist/server/.prerender/` per il pre-rendering. Oggi contiene solo valori di prova; **non mettere mai segreti veri in `.dev.vars`**: in produzione vanno con `wrangler secret put`.

**Da ripetere prima di ogni push** (PowerShell):

```powershell
$t = (Select-String -Path .env -Pattern '^SANITY_WRITE_TOKEN=(.*)$').Matches.Groups[1].Value
npm run build:web
Get-ChildItem web\dist, studio\dist -Recurse -File | Select-String -SimpleMatch $t -List
git log --all -p | Select-String -SimpleMatch $t -List
```

Nessuna riga in uscita = nessun segreto.

## Contenuti e bozze

- Dataset pubblico in lettura (piano gratuito): nel CMS non c'è nulla che non debba essere pubblico. L'indirizzo che riceve i messaggi del modulo è una variabile d'ambiente (`CONTATTI_DESTINATARIO`), non un campo del CMS.
- Le immagini vengono caricate senza EXIF né GPS (rimossi da `foto:prepara`, e lo Studio non li estrae: `metadata: ['lqip','palette']`); il nome originale del file non viene salvato.
- Bozze: verificato che una bozza creata con il token non è leggibile senza token in nessuna prospettiva (`raw`, `published`, `drafts`) né con `getDocument`.

## Studio e accessi

- Nessun login fatto in casa: l'accesso passa dall'autenticazione di Sanity.
- Metodi di login limitati a quelli usati davvero: Google (Irene) ed email + password di Sanity (Davide), con `auth.providers` in `studio/sanity.config.ts`; GitHub escluso. Per l'account con email e password usare una password lunga e unica. È un filtro dell'interfaccia: la protezione vera è che possono entrare solo i membri invitati nel progetto su sanity.io/manage.
- **Per Davide:** il piano gratuito ha solo i ruoli Amministratore e Visualizzatore. Irene, per poter pubblicare, sarà **Amministratrice**: la verifica in due passaggi sul suo account Google è **obbligatoria** prima di invitarla.
- Vision (strumento per interrogare i dati) è attivo solo in sviluppo.
- Il sito pubblico non ha pagine di amministrazione; lo Studio è un'app separata.

## CORS di Sanity

Origini oggi: solo `http://localhost:3333` (Studio in locale), con credenziali. Il sito non fa richieste a Sanity dal browser (legge i dati durante il build), quindi non gli serve un'origine. Da aggiungere al deploy: vedi `docs/deploy.md`.

## Modulo contatti

- Validazione lato server con limiti di lunghezza; caratteri di controllo vietati in nome ed email.
- Campo trappola; verifica Turnstile lato server (chiavi di prova ufficiali in locale; in produzione senza segreto la verifica fallisce sempre, mai la chiave di prova).
- Limite di 5 invii ogni 10 minuti per IP (in memoria in locale; binding Rate Limiting di Cloudflare al deploy).
- Nessun input dell'utente negli header dell'email tranne il Reply-To, che è l'indirizzo validato; oggetto fisso con il nome ripulito; corpo con caratteri speciali neutralizzati.
- Messaggi d'errore generici, nessun dettaglio interno; `Cache-Control: no-store` sulle risposte.

## Dipendenze

`npm audit` segnalava 20 vulnerabilità (3 alte), tutte negli strumenti a riga di comando di Sanity (oclif, rilevamento framework, module federation), non nello Studio pubblicato né nel sito. La correzione proposta da npm era tornare a `sanity@6.1.0`. Invece sono state forzate, con `overrides` nel `package.json` della radice, le versioni corrette delle sole librerie vulnerabili:

| Libreria | Prima | Dopo | Note |
|---|---|---|---|
| undici (7.x) | 7.29.1 | 7.30.2 | stessa versione principale |
| js-yaml (3.x) | 3.13.1 | 3.15.2 | stessa versione principale |
| smol-toml (1.x) | 1.5.2 | 1.9.1 | stessa versione principale |
| minimatch (10.x → 11) | 10.2.6 | 11.0.5 | salto di versione principale, solo per la CLI di Sanity (oclif): verificati `sanity schema validate`, `sanity build`, `sanity cors list` |

Risultato: `npm audit` → 0 vulnerabilità. Quando Sanity aggiornerà le sue dipendenze, gli `overrides` si potranno togliere.

## Da fare al deploy

1. Chiavi Turnstile vere: `PUBLIC_TURNSTILE_SITE_KEY` (variabile al build) e `TURNSTILE_SECRET_KEY` (`wrangler secret put`). Nel pannello Turnstile, limitare il widget al dominio definitivo.
2. `CONTATTI_DESTINATARIO`, `CONTATTI_MITTENTE` e il servizio email reale.
3. Binding Rate Limiting `LIMITE_CONTATTI` in `wrangler.jsonc`.
4. Aggiungere il dominio definitivo (e quello dello Studio pubblicato) alle origini CORS di Sanity.
5. Revocare il token di scrittura usato per il precaricamento; crearne uno nuovo solo se servirà rilanciare l'import.
6. Verificare gli header sul dominio vero (per esempio con securityheaders.com) e che HSTS sia accettabile per tutti i sottodomini prima di aggiungere `preload`.
7. Attivare la verifica in due passaggi sull'account di Irene prima di invitarla come Amministratrice.
