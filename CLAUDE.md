# Sito di Irene Neri — direttive di progetto

Queste regole valgono per ogni sessione di lavoro su questo repository. Il piano operativo, diviso in milestone, è in `ROADMAP.md`. Lo stato di avanzamento è in `docs/STATO.md`.

## Dati di sessione (li compila Davide prima di partire)

- Repository remoto: `https://github.com/DaVesna/ireneneri.photography.git`
- Cartella foto originali (SOLA LETTURA): `C:\Users\dadev\Documents\Progetti\Irene\ireneneri.photography\src\photos\original`
- Cartella di lavoro per la copia delle foto: `C:\Users\dadev\Documents\Progetti\Irene\ireneneri.photography\src\photos\backup`
- Sanity project ID: `10o0605j`, dataset: `production`
- Token Sanity in scrittura: solo nel file `.env` nella root, mai qui

Se uno di questi dati manca quando serve, fermati e chiedilo. Non inventarlo.

## Il progetto in breve

Sito portfolio di Irene Neri, fotografa. Sempre al femminile: "fotografa", mai "fotografo". Fotografa sport, animali, persone ed eventi (verifica le categorie reali sulle cartelle). Zona: Friuli Venezia Giulia (da confermare).

È un progetto personale e non commerciale di Davide, amico di Irene. Si riparte da zero: il codice dei tentativi precedenti è scartato e non va riusato, nemmeno come base.

Il CMS lo userà Irene, che non ha esperienza tecnica. Ogni scelta si giudica anche da qui: se Irene non riesce ad aggiungere un album da sola in dieci minuti, la scelta è sbagliata.

## Stack

- Astro, versione stabile corrente. Pagine pre-renderizzate; un solo endpoint server per il form contatti (adapter Cloudflare).
- Sanity: Studio come CMS, Content Lake per i dati, CDN immagini di Sanity per servire le foto ridimensionate.
- Hosting futuro: Cloudflare Workers. Adesso non si fa nessun deploy.
- Windows, Node LTS gestito con nvm-windows. Davide usa PowerShell: i comandi scritti per lui (README, guide) sono in PowerShell.
- Script di servizio (inventario, copia, anteprime, preparazione, import) in Node.js con `sharp`, non in bash o PowerShell, così girano ovunque.
- Dipendenze al minimo. Niente framework UI nel sito pubblico: HTML, CSS e TypeScript. Lo Studio usa React perché lo richiede Sanity, e resta confinato lì.
- Prima di scrivere codice per Astro, Sanity, l'adapter Cloudflare o Turnstile, controlla la documentazione ufficiale attuale. Non fidarti della memoria su API e versioni.

Struttura del repo:

```
/web        sito Astro
/studio     Sanity Studio
/scripts    inventario foto, copia, anteprime, preparazione, import su Sanity
/docs       STATO, DECISIONI, MANCANTI, guide e report
```

## Pagine

1. Home: foto di benvenuto scelte da Irene nel CMS, breve presentazione di Irene con il suo ritratto, alcuni album in evidenza, invito a scrivere.
2. Album: elenco esplorabile di tutti gli album, filtrabile per categoria (e per anno, se le date lo permettono).
3. Pagina album: hero, titolo, testo, dati essenziali (data, luogo se noto), carosello esplorabile con visore a tutto schermo, passaggio all'album successivo.
4. Chi sono: testo su Irene e una sua foto.
5. Contatti: form che invia un'email a Irene, più link a Instagram e alla mail.
6. Privacy (necessaria per il form, testo segnaposto) e pagina 404.

Tutti i contenuti si modificano dal CMS. Nel codice restano solo le etichette d'interfaccia (pulsanti, messaggi di errore).

## Direzione visiva

I tentativi precedenti sono stati scartati perché asettici: sfondi bianchi, effetto galleria. Serve un sito che faccia venire voglia di guardare le foto, caldo e familiare ma professionale.

Riferimenti scelti da Davide. Prima di progettare, fanne screenshot con Playwright (desktop e mobile):

- https://www.zielecki.com/ per la presenza personale del fotografo, le foto immersive a tutta larghezza, la voce in prima persona
- https://www.pedrontheworld.com/ per la home come sequenza di progetti grandi, ognuno un capitolo
- https://www.ameliaallenphotography.com/ per la sobrietà, il menu essenziale, le foto che parlano da sole

Sono ispirazione, non modelli: non copiarne testi, layout o elementi riconoscibili.

Regole:

- Il calore viene dalle foto e dalla presenza di Irene, non dalla decorazione. Idea forte da valutare per prima: ogni album prende il suo tono di colore dalla propria copertina (palette estratta da Sanity), con contrasto sempre verificato.
- Mai bianco puro né nero puro come sfondo.
- Evita le scelte "di default" che fanno sembrare un sito generato: fondo crema con serif e accento terracotta; nero con un solo colore acido; etichette in maiuscolo spaziato sopra ogni titolo; metadati separati da puntini (A · B · C); freccia → in coda ai link; numerazioni 01/02/03 su cose che non sono sequenze; animazione d'entrata su ogni sezione; card tutte uguali con la stessa ombra.
- Niente decorazioni finto-artigianali (corsivi a mano, carta strappata, cornici) che competono con le foto.
- Tipografia scelta apposta per questo sito: una o due famiglie ben distinte, font ospitati in locale (non da Google Fonts via CDN, per il GDPR).
- Una sola cosa coraggiosa per pagina, il resto quieto. Un solo momento di movimento orchestrato; rispetta `prefers-reduced-motion`.
- Le foto non si deformano e non si ritagliano a caso: usa il punto focale (hotspot) impostato nel CMS.

## Testi

- Solo italiano.
- Brevi, concreti, senza enfasi. Vietati: "emozioni", "magia", "momenti unici", "catturare l'anima", "raccontare storie", superlativi, punti esclamativi.
- Titoli degli album: dai nomi delle cartelle, sistemati (maiuscole, accenti, niente underscore o codici).
- Testi degli album: 2–4 frasi, descrittive e sobrie. Mai inventare nomi di persone, luoghi, date o fatti che non risultano dalle cartelle o dai dati EXIF.
- Pagina Chi sono: testo segnaposto credibile ma chiaramente da sostituire.
- Tutto ciò che non conosci va come segnaposto nel formato `[DA FORNIRE: descrizione]` e viene annotato in `docs/MANCANTI.md`.

## Foto

- La cartella originale è in sola lettura: lì dentro non si crea, rinomina, sposta, modifica o cancella nulla. Si legge soltanto.
- Si lavora su una copia in `<PERCORSO_COPIA_LAVORO>`, che puoi riorganizzare liberamente (cartelle, sottocartelle, nomi).
- Un album = un evento. La struttura parte dai nomi delle cartelle. Guarda le foto solo quando devi scegliere (copertine, foto di benvenuto), e in quel caso usa anteprime piccole e provini a griglia, mai gli originali (2k–8k).
- Prima del caricamento su Sanity ogni foto viene ridotta (lato lungo max 3200 px, JPEG qualità ~88, sRGB, orientamento applicato) e ripulita da tutti i metadati EXIF e GPS.
- Le foto e le loro copie non entrano mai in git.

## Sicurezza (priorità massima)

Il sito sarà pubblico e l'accesso al CMS deve essere solido.

- Nessun sistema di login fatto in casa. L'accesso allo Studio passa dall'autenticazione di Sanity. Limita i metodi di login dello Studio a quelli effettivamente usati da Irene e Davide (default: Google, con verifica in due passaggi attiva sull'account).
- Il sito pubblico non ha pagine di amministrazione. Lo Studio è un'app separata.
- Il dataset è pubblico in lettura (piano gratuito): nel CMS non va nessun dato che non debba essere pubblico. L'indirizzo che riceve i messaggi del form sta in una variabile d'ambiente, non nel CMS.
- Token e segreti solo in `.env` (escluso da git), con un `.env.example` senza valori. Nessun token nel codice del sito pubblico o nel bundle client: verificalo con una ricerca nel build prima di ogni push.
- Il sito legge solo contenuti pubblicati, mai le bozze.
- Form contatti: validazione lato server con limiti di lunghezza, campo trappola anti-bot, Cloudflare Turnstile (chiavi di test ufficiali in locale), limite di invii per IP, nessun input dell'utente negli header dell'email tranne il Reply-To validato, contenuto dell'email con caratteri speciali neutralizzati, messaggi d'errore generici.
- Header di sicurezza: Content-Security-Policy stretta (immagini solo dal sito e da cdn.sanity.io, script solo propri e di Turnstile), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors none.
- CORS su Sanity: solo le origini locali di sviluppo. Il dominio definitivo si aggiunge al deploy.
- `npm audit` pulito, o ogni eccezione motivata, prima della consegna.

## Protezione delle immagini

Davide vuole evitare il "salva immagine con nome". Implementa deterrenti che non rompano accessibilità e navigazione: niente menu contestuale su immagini e visore, trascinamento disabilitato, niente menu da pressione prolungata su iOS. La protezione vera è la risoluzione: il sito usa sempre URL Sanity trasformati (larghezza, formato, qualità), mai l'URL del file caricato, e non serve mai più di 2560 px sul lato lungo. Scrivilo chiaro nella guida: uno screenshot resta sempre possibile.

## Responsive e qualità

- Mobile prima di tutto. Verifica a 390×844, 768×1024, 1440×900, 1920×1080.
- Carosello e visore: tastiera, swipe, clic, link diretto alla singola foto, precaricamento delle foto vicine.
- Immagini con `srcset`, caricamento differito, segnaposto colorato o sfocato (LQIP di Sanity) mentre caricano, dimensioni esplicite per evitare salti di layout.
- Accessibilità: focus visibile, contrasto AA, testo alternativo, navigazione da tastiera completa.
- Obiettivi: LCP sotto 2,5 s in 4G simulato, nessun errore in console, build senza warning rilevanti.

## Modo di lavorare

- Si lavora tutto in una sessione: segui `ROADMAP.md` dall'inizio alla fine senza chiedere conferma a ogni passo. Fermati solo nei punti di blocco elencati lì.
- Dopo ogni sotto-step aggiorna `docs/STATO.md` (cosa è fatto, decisioni, prossimo passo). Se il contesto è stato compattato o riparti da capo, rileggi `docs/STATO.md` e `ROADMAP.md` prima di continuare.
- Le decisioni non ovvie (struttura album, palette, font, compromessi) vanno in `docs/DECISIONI.md`, una riga di motivazione ciascuna.
- Verifica visiva continua: build, server locale, screenshot con Playwright, guardali e correggi prima di andare avanti.
- Git: lavora sul branch `sito-v1`. Il primo commit della sessione è il `.gitignore`. Un commit per ogni sotto-step significativo, messaggi in italiano brevi e descrittivi, push alla fine di ogni milestone. Mai `git add` alla cieca: prima di ogni commit controlla `git status` (niente foto, niente `.env`, niente token).
- Nessun deploy, né del sito né dello Studio: non esiste ancora un server.
- Nessuna operazione distruttiva fuori dal repo e dalla cartella di copia.
- Alla fine produci `docs/REPORT.md`: cosa è stato fatto, come avviarlo, cosa manca.
