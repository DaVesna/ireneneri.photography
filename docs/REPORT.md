# Report finale — sito di Irene Neri

Lavoro svolto il 2026-11-07 sul branch `sito-v1`, seguendo `ROADMAP.md` da M1 a M11. Nessun deploy eseguito.

## Promemoria importante

**Revocare il token di scrittura di Sanity usato per il precaricamento** (sanity.io/manage → progetto → API → Tokens) e svuotare `SANITY_WRITE_TOKEN` nel `.env`. Serve solo per rilanciare `foto:importa`; se un giorno servirà di nuovo, se ne crea uno nuovo.

## Cosa è stato fatto

| Milestone | Risultato |
|---|---|
| M1 Fondamenta | branch `sito-v1`, `.gitignore` come primo commit, npm workspaces `web` / `studio` / `scripts`, Prettier, controllo dei tipi, `.env.example` |
| M2 Foto | inventario in sola lettura con impronta; 74 foto vere in 7 album (tutti Sport), 9 immagini segnaposto escluse; copia ordinata e verificata; provini; copertine, foto di benvenuto e testi scelti. Originale intatto (verificato all'inizio e alla fine) |
| M3 Direzione visiva | analisi dei riferimenti, piano e revisione critica, prototipo statico con due giri di correzioni (`docs/direzione-visiva.md`) |
| M4 Studio | Sanity Studio 6 in italiano, schemi con descrizioni ed esempi, documenti singoli protetti, foto caricabili in blocco e riordinabili, avviso foto troppo grandi, solo LQIP e palette (niente EXIF/GPS), accesso solo Google |
| M5 Precaricamento | 74 foto preparate (3200 px, senza metadati, 35,5 MB), import rilanciabile con `--prova`; 7 album, 4 categorie, home, Chi sono, Contatti, Privacy, Impostazioni pubblicati |
| M6 Sito | Astro 7 + adapter Cloudflare, dati da Sanity senza token, immagini dalla CDN di Sanity (max 2560 px, `srcset`, LQIP, punto focale), font locali, deterrenti sulle immagini |
| M7 Pagine | home a capitoli, elenco album con filtro nell'URL, pagina album con carosello, visore a tutto schermo, link `#foto-N`, tinta dalla copertina; Chi sono, Contatti, Privacy, 404, SEO |
| M8 Modulo contatti | validazione server, trappola, Turnstile, limite per IP, email dietro interfaccia (oggi nel log), funziona anche senza JavaScript; 12 test |
| M9 Sicurezza | CSP stretta e header (0 violazioni), nessun segreto nel build né nella storia, bozze non leggibili, CORS minimo, `npm audit` a 0 (`docs/sicurezza.md`) |
| M10 Qualità | axe 0 errori gravi su 9 pagine; tastiera completa; reduced-motion; Lighthouse mobile 98–99 prestazioni e 100 accessibilità, LCP 2,1–2,4 s |
| M11 Consegna | README, guida per Irene, istruzioni di deploy, dati mancanti, questo report |

## Come avviarlo

Dettagli nel `README.md`. In breve, da PowerShell nella cartella del repository:

```powershell
nvm use 26.13.0        # Node 26 è installato; renderlo predefinito richiede PowerShell da amministratore
npm install
npm run dev:web        # http://localhost:4321
npm run dev:studio     # http://localhost:3333
```

## Decisioni principali

Elenco completo con le motivazioni in `docs/DECISIONI.md`. Le più importanti:

- **Un album per ogni cartella foglia**, senza sezioni interne; Mika e Piero album separati. Titoli dal nome della cartella.
- **Escluse le cartelle `matrimonio-anna-e-luca` e `nina-e-il-prato`**: sfocature generate da 18 KB con un `meta.json` di dati inventati. Pubblicarle avrebbe fatto passare per foto di Irene immagini finte. Le categorie Persone, Animali, Eventi esistono ma non hanno album.
- **Fondo scuro caldo e nessun colore d'accento fisso**: il colore di ogni pagina album è la tinta presa dalla copertina (palette di Sanity, luminosità fissa, contrasto ≥ 7:1).
- **Archivo stretto per i titoli, Literata per la prosa**, serviti dal sito.
- **Striscia di foto ad altezza fissa** per benvenuto e carosello: verticali e orizzontali insieme senza ritagli (le orizzontali si inquadrano sul punto focale solo nella striscia di benvenuto, su schermi stretti).
- **Un solo movimento**: la View Transition del browser tra capitolo/elenco e pagina album, spenta con reduced-motion.
- **Modulo come funzioni pure testabili**, servizio email reale da collegare al deploy.
- **`overrides` mirati** invece di `npm audit fix --force` (che avrebbe riportato Sanity a una versione vecchia).

## Problemi aperti

1. **Prova dello Studio con l'accesso di Davide da fare.** Creazione, riordino ed eliminazione di un album sono stati verificati via API e con `sanity schema validate` / `sanity build`, ma non cliccando nello Studio: Davide ha scelto di rimandare l'accesso con Google. Da fare: entrare in http://localhost:3333 e creare un album di prova con 3 foto.
2. **Node 26 non è ancora la versione predefinita** del sistema (`nvm use 26.13.0` da amministratore). Con la 22.23.2 Astro non parte.
3. **Contenuti da fornire**: email, Instagram, ritratto, testo di Chi sono, privacy, luoghi di alcuni album (`docs/MANCANTI.md`).
4. **Elisa**: 5 foto su 10 sono a bassa risoluzione (1000–1500 px) e risultano morbide a tutto schermo.
5. **Boxe** ha una sola foto, del 2013: va bene tecnicamente (niente carosello, la copertina apre il visore), ma come album è debole.
6. **Email del modulo**: oggi finisce nel log; il servizio vero si sceglie al deploy.
7. **Rete instabile durante il lavoro**: alcuni push e un paio di build sono falliti per errori DNS momentanei. Il sito ora ripete le richieste a Sanity, ma se un build fallisce va semplicemente rilanciato.
8. **Overrides di sicurezza**: forzano versioni più recenti di quattro librerie usate dalla CLI di Sanity (una con salto di versione principale, minimatch 11). Al prossimo aggiornamento di Sanity provare a toglierli e rifare `npm audit`.
9. **Misure di prestazione**: fatte in locale con compressione gzip. Il dato vero va riletto dopo il deploy (per esempio con PageSpeed Insights).

## Suggerimenti

- **Aggiornamento automatico del sito** con webhook firmato di Sanity → build e deploy (`docs/deploy.md`, sezione 4, strada A): senza, Irene pubblica ma il sito non cambia.
- **Email con Cloudflare Email Routing**: gratuita e senza chiavi esterne.
- **Primo album nuovo insieme a Irene**: dieci minuti con la guida aperta per verificare che sia davvero autonoma, ed eventuali ritocchi alle descrizioni dei campi.
- **Più album prima della pubblicazione**: con sette album tutti di sport il filtro per categoria non compare; un paio di album di persone o eventi darebbero più varietà alla home.
- **Rivedere i testi degli album con Irene**: sono sobri e basati su provini e date, ma solo lei conosce il contesto (nomi delle palestre, degli spettacoli, dei luoghi).
- **Controllo periodico**: `npm run qualita` e `npm run lighthouse` dopo modifiche al codice; `npm audit` ogni tanto.
