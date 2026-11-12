# Roadmap — sito di Irene Neri

Da eseguire in ordine, in una sola sessione. Le regole di `CLAUDE.md` valgono sempre e prevalgono su questo file. Ogni milestone ha un criterio di "fatto": non si passa alla successiva finché non è soddisfatto.

## Punti di blocco

Sono gli unici momenti in cui ti fermi e chiedi a Davide:

- manca un dato di sessione in `CLAUDE.md` o una variabile in `.env`;
- serve un login interattivo nel browser (CLI di Sanity);
- il caricamento su Sanity supererebbe i 10 GB complessivi;
- la struttura delle cartelle è ambigua al punto che due letture darebbero album molto diversi;
- un'operazione toccherebbe la cartella delle foto originali.

Tutto il resto lo decidi tu e lo annoti in `docs/DECISIONI.md`.

---

## M0 — Prerequisiti (li fa Davide prima di avviare la sessione)

- [V] Repository remoto creato e clonato in locale; Claude Code avviato nella root, con `CLAUDE.md` e `ROADMAP.md` lì dentro.
- [V] Node LTS attivo con nvm-windows (`node -v` risponde).
- [V] Account Sanity creato (consigliato: login Google con verifica in due passaggi) e progetto creato su sanity.io/manage, piano gratuito.
- [V] `npx sanity login` eseguito una volta in PowerShell.
- [V] Token API con permesso di scrittura creato su sanity.io/manage.
- [V] File `.env` nella root con `SANITY_PROJECT_ID`, `SANITY_DATASET=production`, `SANITY_WRITE_TOKEN`.
- [V] Sezione "Dati di sessione" di `CLAUDE.md` compilata.

---

## M1 — Fondamenta del repository

1. Crea il branch `sito-v1`. Se il repo contiene file dei tentativi precedenti, rimuovili in un commit dedicato: restano nella storia di git.
2. Primo commit: `.gitignore` con `node_modules`, `dist`, `.astro`, `.sanity`, `.env*` (eccetto `.env.example`), cartella di copia delle foto, anteprime, screenshot temporanei, `Thumbs.db`, `desktop.ini`. Verifica con `git status` che `.env` non compaia.
3. Struttura `/web`, `/studio`, `/scripts`, `/docs`. npm workspaces alla radice con script comodi: `dev:web`, `dev:studio`, `foto:inventario`, `foto:copia`, `foto:anteprime`, `foto:prepara`, `foto:importa`.
4. `.nvmrc`, campo `engines`, Prettier, controllo dei tipi.
5. `.env.example` senza valori.
6. `docs/STATO.md`, `docs/DECISIONI.md`, `docs/MANCANTI.md` con intestazione.
7. README minimo con l'avvio in PowerShell.

**Fatto quando:** `npm install` dalla radice funziona, il `.gitignore` è nel primo commit, `git status` è pulito e non mostra `.env`.

---

## M2 — Ricognizione e copia delle foto

1. `foto:inventario`, in sola lettura sull'originale: albero delle cartelle, numero di file e peso per cartella, dimensioni minime e massime, date di scatto EXIF (prima e ultima) per cartella, file non JPEG o anomali. Salva prima un'impronta dell'originale (conteggio file e date di modifica) per il controllo finale. Output aggregato per cartella in `docs/inventario-foto.md`.
2. Dall'inventario ricava la struttura degli album in `docs/piano-album.md`: tabella cartella originale → album, con titolo sistemato, slug, categoria, data, sezioni interne solo se la struttura reale le giustifica. Un album = un evento.
3. Ordine delle foto dentro ogni album: cronologico per data di scatto, che per un evento coincide con l'ordine del racconto. Con sezioni interne, prima la sezione e poi l'ora di scatto.
4. `foto:copia`: copia l'originale nella cartella di lavoro secondo il piano, con nomi normalizzati (minuscole, trattini, numerazione progressiva che fissa l'ordine). Verifica a fine copia: stesso numero di file, checksum su un campione.
5. `foto:anteprime`: miniature (lato lungo 400 px) e provini a griglia per album, una ventina di foto per foglio, in una cartella esclusa da git.
6. Usando i provini, scegli la copertina di ogni album e 6–8 foto di benvenuto per la home: le più forti, varie per categoria, con un equilibrio tra orizzontali e verticali. Annota le scelte in `piano-album.md`.
7. Controllo finale: l'impronta dell'originale è identica a quella iniziale.

**Fatto quando:** copia completa e verificata, `piano-album.md` con tutte le scelte, originale intatto.

---

## M3 — Direzione visiva

1. Screenshot dei tre siti di riferimento (home e una pagina interna, desktop e mobile). In `docs/direzione-visiva.md` annota cosa funziona e perché, in termini di struttura, ritmo, densità e tono, non di dettagli da copiare.
2. Piano di design, prima passata: palette di 4–6 colori con valori hex, famiglie tipografiche e ruoli, concetto di layout per ogni pagina con wireframe ASCII, principi. Spiega come la tinta presa dalle copertine entra nelle pagine album e come resta leggibile.
3. Revisione critica del piano contro il brief e contro l'elenco delle scelte di default in `CLAUDE.md`: cosa cambi e perché. Solo dopo si scrive codice.
4. Prototipo statico di home e pagina album con 3–4 foto reali prese dalla copia, non ancora collegato al CMS. Screenshot a 390 e 1440 px, autocritica, almeno un giro di correzioni. Togli un elemento prima di chiudere.

**Fatto quando:** `direzione-visiva.md` completo e prototipo convincente a 390 e 1440 px.

---

## M4 — Modello dei contenuti e Studio

1. Inizializza lo Studio in `/studio`, collegato a project ID e dataset `production`.
2. Interfaccia in italiano (pacchetto di localizzazione ufficiale dello Studio, verificane il nome attuale), titolo "Sito di Irene".
3. Schemi (asterisco = obbligatorio):
   - `home` (documento singolo): fotoBenvenuto* (3–10 immagini, hotspot, testo alternativo), fraseBenvenuto (facoltativa, max 140 caratteri), albumInEvidenza (riferimenti, max 6).
   - `album`: titolo*, slug* (generato dal titolo), categoria (riferimento), data*, luogo, copertina* (hotspot, testo alternativo*), testo (paragrafi con grassetto, corsivo e link; max ~1200 caratteri), sezioni facoltative solo se il piano album le prevede, foto* (immagini caricabili in blocco trascinandole e riordinabili trascinando; testo alternativo e didascalia facoltativi, con testo alternativo di ripiego "Titolo album, foto N di M").
   - `categoria`: titolo*, slug*, descrizione breve, ordine.
   - `chiSono` (singolo): titolo, testo, ritratto* (hotspot, testo alternativo*), foto aggiuntive facoltative.
   - `contatti` (singolo): testo introduttivo, email pubblica, link Instagram.
   - `impostazioni` (singolo): nome del sito, descrizione per i motori di ricerca, immagine di condivisione, testo del piede di pagina.
4. Usabilità per Irene: ogni campo ha etichetta e descrizione in italiano semplice, con un esempio. Validazioni con messaggi chiari che dicono come rimediare. Elenchi con miniatura. Album ordinati per data, più recenti in alto. Documenti singoli in cima alla barra laterale, senza "elimina" e "duplica". Strumenti tecnici (Vision) solo in sviluppo.
5. Avviso, non blocco, se una foto caricata supera i 4000 px sul lato lungo: "Foto molto grande: esportala a 3000 px dal lato lungo prima di caricarla".
6. Metadati delle immagini: LQIP e palette attivi; EXIF e posizione non estratti.
7. Metodi di login dello Studio limitati come da `CLAUDE.md`.

**Fatto quando:** `npm run dev:studio` apre lo Studio in italiano; un album di prova con 3 foto si crea, si riordina e si elimina senza errori.

---

## M5 — Preparazione immagini e precaricamento

1. `foto:prepara`: dalla copia di lavoro genera le versioni da caricare (lato lungo max 3200 px, JPEG ~88, sRGB, orientamento applicato, EXIF e GPS rimossi). Verifica su un campione che non resti alcun metadato.
2. Calcola il peso totale da caricare. Oltre i 10 GB è un punto di blocco.
3. `foto:importa`: carica le immagini e crea i documenti. ID deterministici (`album-<slug>`, `categoria-<slug>`), rilanciabile senza creare duplicati, opzione `--prova` che mostra cosa farebbe senza scrivere, avanzamento a schermo, ripresa dopo un'interruzione. Prima esegui `--prova`, poi l'import vero.
4. Contenuti da precaricare:
   - categorie;
   - tutti gli album, con titoli sistemati, testi brevi scritti secondo le regole di `CLAUDE.md`, date, copertine scelte e foto in ordine;
   - home, con le foto di benvenuto scelte in M2 e alcuni album in evidenza;
   - chiSono, con testo segnaposto e un ritratto segnaposto: un'immagine neutra con scritto "Ritratto da sostituire", mai la foto di un'altra persona fatta passare per Irene;
   - contatti e impostazioni, con `[DA FORNIRE: …]` dove manca il dato.
5. Aggiorna `docs/MANCANTI.md`.

**Fatto quando:** lo Studio mostra tutti gli album completi, un secondo lancio dell'import non crea duplicati, le immagini caricate non contengono EXIF.

---

## M6 — Fondamenta del sito

1. Progetto Astro in `/web` con adapter Cloudflare; pagine pre-renderizzate per default.
2. Un unico modulo di accesso ai dati: client Sanity in sola lettura, solo contenuti pubblicati, query GROQ tipizzate, nessun token.
3. Componente immagine: URL trasformati di Sanity, `srcset` e `sizes` corretti, formato automatico, hotspot, LQIP come segnaposto, dimensioni esplicite. Larghezza massima servita 2560 px.
4. Token di design dalla M3 come variabili CSS; font in locale; layout di base, intestazione, navigazione (anche mobile), piede di pagina.
5. Deterrenti contro il salvataggio delle immagini (vedi `CLAUDE.md`) come comportamento globale.

**Fatto quando:** una pagina di prova mostra un album reale da Sanity con immagini nitide e leggere a tutte e quattro le larghezze.

---

## M7 — Pagine

1. Home.
2. Album (esplora): filtro per categoria, ed eventualmente per anno, con lo stato del filtro nell'URL; ordinamento per data; gestione di elenchi lunghi ("mostra altri" o paginazione); stato vuoto con indicazione utile.
3. Pagina album: hero, titolo, testo, dati; carosello esplorabile (swipe, frecce, tastiera, contatore, precaricamento delle vicine); visore a tutto schermo; vista d'insieme a miniature per saltare a una foto; link diretto alla singola foto (`#foto-12`); tinta dalla palette della copertina; album precedente e successivo.
4. Chi sono.
5. Contatti: impaginazione. Il funzionamento arriva in M8.
6. Privacy, con testo segnaposto `[DA FORNIRE: informativa privacy]`, e 404.
7. SEO di base: titoli e descrizioni dal CMS, immagini di condivisione, sitemap, robots.txt.

**Fatto quando:** tutte le pagine funzionano con i dati reali; screenshot alle quattro larghezze revisionati e difetti corretti.

---

## M8 — Form contatti

1. Campi: nome, email, tipo di richiesta (categorie più "altro"), messaggio, consenso privacy obbligatorio. Campo trappola nascosto.
2. Endpoint server: validazione con limiti di lunghezza, Turnstile verificato lato server (chiavi di test ufficiali in locale), limite di invii per IP, risposte generiche.
3. Invio dell'email dietro un'interfaccia unica. In locale un invio finto che scrive il messaggio nel log; il servizio reale, da scegliere al deploy, si collega senza toccare il resto. Destinatario da variabile d'ambiente. Reply-To uguale all'email del mittente validata; oggetto fisso con il nome ripulito.
4. Esperienza: errori accanto ai campi, conferma chiara dopo l'invio, funzionamento anche senza JavaScript.

**Fatto quando:** un invio valido arriva nel log; invii non validi, bot sul campo trappola, Turnstile fallito e raffiche di invii vengono respinti; test automatici coprono questi casi.

---

## M9 — Sicurezza

1. Header di sicurezza e CSP nel formato supportato da Cloudflare Workers (per esempio `_headers`); il sito funziona con la CSP attiva, Turnstile compreso.
2. Ricerca di segreti nel build (`dist`), nel repo e nella storia di git: zero risultati.
3. Verifica che le bozze non siano leggibili senza token.
4. CORS di Sanity con sole origini locali; elenco delle origini da aggiungere al deploy in `docs/deploy.md`.
5. Studio con metodi di login limitati. Nota per Davide: il piano gratuito ha solo i ruoli Amministratore e Visualizzatore, quindi Irene sarà Amministratrice e la verifica in due passaggi sul suo account è obbligatoria.
6. `npm audit` in tutti i workspace.
7. `docs/sicurezza.md`: cosa è fatto e cosa resta da fare al deploy.

**Fatto quando:** checklist completa, nessun segreto trovato, CSP attiva senza errori in console.

---

## M10 — Responsive, accessibilità, prestazioni

1. Screenshot di tutte le pagine alle quattro larghezze; correggi ogni difetto.
2. Prova da tastiera di carosello, visore, menu e form.
3. Controllo automatico di accessibilità (axe) su ogni pagina: zero errori gravi.
4. `prefers-reduced-motion` rispettato ovunque.
5. Lighthouse in modalità mobile su home e pagina album: obiettivo almeno 90 in prestazioni e accessibilità. Annota i risultati.

**Fatto quando:** tutte le verifiche sono superate e annotate in `docs/STATO.md`.

---

## M11 — Consegna

1. `README.md`: requisiti, installazione, avvio di sito e Studio in PowerShell, script delle foto, variabili d'ambiente.
2. `docs/guida-irene.md`, in italiano semplice e senza gergo. Deve spiegare come:
   - entrare nello Studio;
   - creare un album, caricare e ordinare le foto, scegliere copertina e punto focale;
   - pubblicare;
   - cambiare le foto della home e modificare Chi sono;
   - esportare le foto prima di caricarle (3000 px sul lato lungo, metadati rimossi), passo per passo.
3. `docs/deploy.md`, solo istruzioni e niente esecuzione. Deve coprire:
   - Cloudflare Workers e variabili d'ambiente;
   - chiavi Turnstile vere e servizio email;
   - dominio, CORS e deploy dello Studio;
   - aggiornamento del sito quando Irene pubblica, con pro e contro di ricostruzione automatica via webhook firmato oppure rendering su richiesta.
4. `docs/MANCANTI.md` completo: ogni dato segnaposto, dove si trova, chi lo deve fornire.
5. `docs/REPORT.md`: cosa è stato fatto, decisioni principali, problemi aperti, suggerimenti.
6. Promemoria in `REPORT.md`: revocare il token di scrittura usato per il precaricamento.
7. Push finale del branch `sito-v1`.

**Fatto quando:** Davide può clonare il repo, seguire il README e vedere sito e Studio funzionanti con i contenuti precaricati.

---

## Dopo la roadmap

La roadmap M1–M11 è stata completata il 7 novembre 2026. Lo stato aggiornato, i prossimi passi e le istruzioni per riprendere sono in `docs/STATO.md`, sezione "Riprendere il lavoro".

- **8 novembre 2026 — stile v2 e privacy (fatto).** Lo stile della M3 è stato scartato e rifatto su nuovi riferimenti (`docs/direzione-visiva.md`); privacy di Davide caricata e allineata al sito (`docs/privacy-proposta.md`).
- **Prossimi passi (da fare):** revisione dello stile v2 da parte di Davide; acquisto del dominio e allineamento di privacy, `SITO_URL`, CORS, Turnstile e Web Analytics; contenuti mancanti di Irene (`docs/MANCANTI.md`); deploy seguendo `docs/deploy.md`; revoca del token di scrittura.
