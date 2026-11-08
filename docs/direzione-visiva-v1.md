# Direzione visiva — versione 1 (scartata)

> Scartata da Davide l’8 novembre 2026: il sito non piaceva. Resta qui come storia delle scelte. La direzione attuale è in `docs/direzione-visiva.md`.

Screenshot dei riferimenti in `screenshots/riferimenti/` (esclusa da git). Zielecki blocca i browser automatici con una verifica Cloudflare: le sue schermate sono state guardate nel browser integrato, senza aggirare la verifica.

## 1. Cosa funziona nei riferimenti

### zielecki.com — presenza personale

- **Struttura.** Una foto a tutto schermo in apertura, il menu appoggiato sul bordo basso della foto che poi resta in alto. Subito dopo, quattro foto in fila, poi blocchi di testo, poi "Hej! I'm Chris" con il suo ritratto grande accanto al testo.
- **Tono.** Prima persona dall'inizio. Il fotografo si presenta con faccia e nome a metà pagina: il visitatore sa con chi sta parlando prima di arrivare ai contatti.
- **Ritmo e densità.** Alterna pieni (foto grandi) e vuoti (testo su fondo scuro con molto margine). La pagina è lunga ma ogni schermata ha un solo soggetto.
- **Da prendere:** il ritratto del fotografo dentro la home, non solo in "Chi sono"; il fondo scuro che fa da cornice; la voce in prima persona.
- **Da evitare:** l'etichetta in maiuscolo spaziato sopra il titolo, il carattere monospazio per i testi lunghi (stanca), i pulsanti con freccia.

### pedrontheworld.com — la home come sequenza di capitoli

- **Struttura.** Ogni progetto è una fascia larga quanto lo schermo con una foto (o un video) e il nome del progetto sopra. Si scorre da un capitolo all'altro, senza griglia.
- **Ritmo.** Una fascia per schermata, tutte della stessa altezza: è il ritmo di un libro fotografico sfogliato. Lo spazio bianco tra le fasce separa i capitoli.
- **Da prendere:** la sequenza di capitoli grandi al posto della griglia di miniature; un progetto alla volta.
- **Da evitare:** il titolo sottile in maiuscolo sovrapposto alla foto (si legge male e copre il soggetto); la scelta funziona con foto orizzontali, mentre il 88% delle foto di Irene è verticale (65 su 74). Bisogna ripensare il capitolo per le verticali.

### ameliaallenphotography.com — sobrietà

- **Struttura.** Logo, tre voci di menu (Portfolio, About, Contact), due icone. Poi solo foto in griglia a tre colonne, a piena altezza, con spazi sottili.
- **Densità.** Pochissimo testo, nessun elemento che non sia una foto o un modo per raggiungerla. Il menu non compete con le immagini.
- **Da prendere:** il menu essenziale (tre voci), l'assenza di decorazione, le foto alla loro proporzione.
- **Da evitare:** il fondo bianco e la griglia uniforme, cioè proprio l'effetto galleria asettico che ha fatto scartare i tentativi precedenti.

### Sintesi

Dal primo la persona, dal secondo il racconto per capitoli, dal terzo il silenzio intorno alle foto. Nessuno dei tre ha un colore proprio: il colore lo portano le foto. È la strada giusta anche qui, con un'aggiunta: far uscire il colore dalla foto e lasciarlo sulla pagina.

## 2. Le foto di Irene, prima di progettare

- 74 foto, tutte di sport: pole dance (palco, studio, all'aperto), palestra, boxe.
- 65 verticali su 74. Le copertine orizzontali sono tre (Piero, Elisa, Teatro di Monfalcone).
- Fondi molto diversi: palco buio con luci colorate, studio bianco, bianco e nero, campo da basket azzurro e arancio al tramonto.
- Ne consegue: il layout deve dare il meglio con le verticali; lo sfondo deve reggere sia foto chiare sia foto buie; il colore di contorno non può essere uno solo per tutti gli album.

## 3. Piano di design — prima passata

### Palette

| Ruolo | Nome | Hex |
|---|---|---|
| Fondo | Carbone | `#1c1a18` |
| Superfici (campi del form, riquadri) | Grafite | `#2a2724` |
| Testo principale | Gesso | `#ece8e2` |
| Testo secondario | Cenere | `#a8a199` |
| Accento del sito | Ottone | `#c9a25a` |
| Tinta dell'album | dalla copertina | calcolata |

### Tipografia

- **Archivo** (variabile, assi peso e larghezza): titoli in larghezza stretta e peso alto, menu ed etichette d'interfaccia in larghezza normale.
- **Literata** (variabile): testi lunghi, cioè la voce di Irene (presentazione, Chi sono, testi degli album).
- Entrambi con licenza OFL, file woff2 serviti dal sito stesso.

### Tinta dalla copertina

Sanity calcola la palette di ogni immagine caricata. Si prende il colore `darkMuted` della copertina (in mancanza, `dominant`), lo si porta in OKLCH, si fissa la luminosità a 0,25 e si limita la saturazione a 0,05 (regola corretta nel prototipo, vedi sezione 6): ne esce un fondo scuro che ha il tono della foto ma non compete con lei. Per i dettagli (filetti, link, contatore) si usa la stessa tinta a luminosità 0,82. Il testo resta Gesso. Il contrasto viene calcolato in build: se Gesso sulla tinta scende sotto 7:1 si abbassa la luminosità del fondo fino a raggiungerlo.

### Layout

**Home**

```
┌────────────────────────────────────────────────┐
│ Irene Neri                Album  Chi sono  Contatti │
├────────────────────────────────────────────────┤
│ ┌────┐┌────────┐┌────┐┌────┐┌────────┐┌──     │  striscia di foto di benvenuto,
│ │    ││        ││    ││    ││        ││        │  stessa altezza, proporzioni vere,
│ │    ││        ││    ││    ││        ││        │  scorre in orizzontale
│ └────┘└────────┘└────┘└────┘└────────┘└──     │
│ frase di benvenuto (facoltativa)               │
├────────────────────────────────────────────────┤
│  ┌──────┐   Sono Irene, fotografa. Lavoro...   │  presentazione:
│  │ritr. │   due o tre frasi in prima persona   │  ritratto + voce
│  └──────┘   Chi sono                           │
├────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ tinta album 1 ░░░░ │  capitolo: fondo nella tinta
│ ░ Teatro di        ┌──────────────┐ ░░░░░░░░░░ │  della copertina,
│ ░ Monfalcone       │  copertina   │ ░░░░░░░░░░ │  copertina verticale alta
│ ░ 22 marzo 2026    │  verticale   │ ░░░░░░░░░░ │  quasi quanto lo schermo
│ ░ Guarda l'album   └──────────────┘ ░░░░░░░░░░ │
├────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ tinta album 2 ░░░░ │
│ ...                                            │
├────────────────────────────────────────────────┤
│ Vuoi scrivermi? due righe + link Contatti      │
├────────────────────────────────────────────────┤
│ piede: testo, Instagram, email, Privacy        │
└────────────────────────────────────────────────┘
```

**Album (elenco)**

```
┌────────────────────────────────────────────────┐
│ Album                                          │
│ [Tutti] [Sport] [Persone]...   Anno [tutti ▾]  │
├────────────────────────────────────────────────┤
│ 2026                                           │
│ ┌──┐ Teatro di Monfalcone     22 marzo   10 foto │  righe, non card:
│ └──┘                                           │  miniatura alla sua proporzione,
│ ┌────┐ Elisa                  21 marzo   10 foto │  al passaggio la riga prende
│ └────┘                                         │  la tinta dell'album
│ 2013                                           │
│ ┌──┐ Boxe                     19 luglio   1 foto │
└────────────────────────────────────────────────┘
```

**Pagina album**

```
┌────────────────────────────────────────────────┐  tutta la pagina nella tinta
│ ░ Irene Neri                Album Chi sono ... │
│ ░ ┌──────────────┐  Cata e Alice              │  copertina verticale + titolo;
│ ░ │  copertina   │  14 febbraio 2026, Sport   │  se orizzontale, copertina a
│ ░ │              │  testo dell'album (2–4     │  tutta larghezza e testo sotto
│ ░ └──────────────┘  frasi)                    │
│ ░ ┌───┐┌───┐┌──────┐┌───┐┌──              3/7 │  carosello: stessa altezza,
│ ░ │   ││   ││      ││   ││   ‹ ›             │  scorre, clic = visore
│ ░ └───┘└───┘└──────┘└───┘└──                  │
│ ░ Tutte le foto (griglia di miniature)        │
│ ░ Album successivo: Elisa ───────────────────  │  fascia nella tinta del successivo
└────────────────────────────────────────────────┘
```

**Chi sono**: ritratto grande a sinistra (sopra, su mobile), testo in Literata a destra, colonna di lettura stretta (60–65 caratteri).

**Contatti**: due colonne su desktop, testo introduttivo ed email/Instagram a sinistra, form a destra; una colonna su mobile.

### Principi

1. La foto decide: proporzioni vere, nessun ritaglio se non sul punto focale scelto da Irene.
2. Un solo colore forte per pagina, ed è quello della foto.
3. Testo poco e vicino a ciò che descrive.
4. Un solo movimento orchestrato: il passaggio da un capitolo della home alla pagina dell'album (la copertina si allarga e diventa l'immagine d'apertura, il fondo cambia tinta), con le View Transitions native del browser. Con `prefers-reduced-motion` il passaggio è immediato.
5. Le stesse proporzioni e la stessa altezza di riga per la striscia di benvenuto e per il carosello: un unico modo di guardare le foto in tutto il sito.

## 4. Revisione critica della prima passata

Controllo contro il brief e contro l'elenco delle scelte "di default" di `CLAUDE.md`:

| Punto | Esito | Cosa cambio |
|---|---|---|
| Fondo crema + serif + terracotta | Evitato (fondo scuro caldo, nessun terracotta). Ma l'accento **Ottone** con Literata su fondo scuro richiama comunque il "lusso di default". | Tolgo l'accento fisso. Il colore lo dà solo la tinta dell'album; dove non c'è un album (Chi sono, Contatti) i link sono sottolineati in Gesso. |
| Nero + un solo colore acido | Evitato: Carbone è un bruno caldo, non nero; nessun colore acido. | — |
| Etichette in maiuscolo spaziato sopra i titoli | Nel piano non ci sono, ma i nomi dei mesi e la categoria rischiavano di diventarlo. | Data e categoria in tondo, minuscolo, stessa dimensione del testo. |
| Metadati separati da puntini | Il wireframe dell'elenco album li evitava; la pagina album no ("14 febbraio 2026, Sport"). | Data e luogo in frase ("14 febbraio 2026, Monfalcone"); la categoria è un link a parte sotto. Il contatore delle foto in elenco va in una colonna allineata, senza separatori. |
| Freccia → in coda ai link | "Guarda l'album" non la ha. | Nessuna freccia. Le frecce compaiono solo nei pulsanti del carosello, dove sono un comando e non una decorazione. |
| Numerazioni 01/02/03 | Nessuna. Il contatore "3 / 7" del carosello è una posizione in una sequenza vera: resta. | — |
| Animazione d'entrata su ogni sezione | Nessuna: un solo movimento (View Transition). | — |
| Card uguali con la stessa ombra | L'elenco album è a righe; nessuna ombra nel sito. | — |
| Decorazioni finto-artigianali | Nessuna. | — |
| Il calore viene dalle foto e da Irene | Il ritratto è nella home e la voce è in prima persona. La striscia di benvenuto mostra più foto insieme: più "album di famiglia" che vetrina. | — |
| "Una sola cosa coraggiosa per pagina" | Home: i capitoli tinti. Ma anche la striscia di benvenuto è forte. | La striscia resta quieta: niente scorrimento automatico, nessun testo sovrapposto, altezza contenuta (non tutto schermo) così il primo capitolo tinto si intravede già nella prima schermata su desktop. |
| Foto verticali | Il capitolo di Pedron era pensato per foto larghe. | Il capitolo si adatta alla proporzione: verticale = copertina alta su un lato e testo sull'altro; orizzontale = copertina a tutta larghezza e testo sotto. |
| Due famiglie ben distinte | Archivo stretto e Literata sono lontani per forma e funzione. | Archivo solo per titoli e interfaccia, Literata solo per i testi in prosa: nessuna sovrapposizione di ruoli. |
| Copertine in bianco e nero (Cata e Alice, Boxe) | La tinta viene grigia neutra. | Va bene così: è coerente con la foto. Verifico nel prototipo che non sembri "spenta". |
| Leggibilità sulla tinta | Calcolata in build, minimo 7:1 per il testo principale. | Anche Cenere va verificato sulla tinta: se scende sotto 4,5:1 si usa Gesso al 80% di opacità. |

## 5. Piano finale

### Palette

| Ruolo | Nome | Hex | Contrasto su Carbone |
|---|---|---|---|
| Fondo | Carbone | `#1c1a18` | — |
| Superfici | Grafite | `#2a2724` | — |
| Testo principale | Gesso | `#ece8e2` | 14,2:1 |
| Testo secondario | Cenere | `#a8a199` | 6,8:1 |
| Errori del form | Corallo chiaro | `#f2a48f` | 8,7:1 |
| Tinta dell'album | dalla copertina | calcolata, ≥ 7:1 con Gesso | — |

Contrasti calcolati con `web/src/lib/tinta.js` (formula WCAG). Su Grafite: Gesso 12,2:1, Cenere 5,8:1.

### Tipografia

| Ruolo | Famiglia | Impostazioni |
|---|---|---|
| Nome del sito, titoli di pagina e album | Archivo | larghezza 68, peso 650, interlinea 0,95, `clamp(2.6rem, 7vw, 6.5rem)` per i titoli d'apertura |
| Menu, pulsanti, date, contatori | Archivo | larghezza 100, peso 450, 0,95–1rem |
| Testi in prosa | Literata | peso 380, 1,125rem (1,0625 su mobile), interlinea 1,6, colonna max 34em |

### Movimento

Solo la View Transition tra home ed elenco album da una parte e pagina album dall'altra (`@view-transition { navigation: auto }` e `view-transition-name` sulla copertina). Disattivata con `prefers-reduced-motion: reduce`. Nessuna animazione d'entrata, nessuno scorrimento automatico.

## 6. Prototipo

File statici in `prototipo/` (le foto vengono copiate in `prototipo/foto/`, esclusa da git): `index.html` (home) e `album.html` (pagina album). Lo script `prototipo/prepara.mjs` genera le immagini ridotte dalla copia di lavoro e calcola le tinte con lo stesso algoritmo che userà il sito.

Revisione a 390 e 1440 px:

Screenshot in `screenshots/prototipo/` (esclusa da git).

**Giro 1, cosa non andava**

1. **Tinte spente.** Con `darkMuted` e saturazione 0,05 le tre copertine davano tre grigi quasi uguali: l'idea centrale spariva. Correzione: il colore di partenza è il più saturo della copertina (`darkVibrant`, poi `vibrant`, poi `dominant` nella palette di Sanity), la saturazione è il 60% di quella di partenza con un massimo di 0,07. Risultato: Teatro di Monfalcone `#3a140a` (bruno ruggine), No Border Village `#0e2335` (blu notte), Cata e Alice `#222222` (grigio, giusto per il bianco e nero). Gesso resta oltre 13:1 su tutte.
2. **Foto ripetute.** La striscia di benvenuto si apriva con la copertina del primo capitolo. Regola: le foto di benvenuto precaricate non sono copertine degli album in evidenza. Piano aggiornato.
3. **Orizzontali tagliate su mobile.** Nella striscia una foto orizzontale alta 58vh usciva dallo schermo. Ogni foto ora è limitata alla larghezza dello schermo.
4. **Carosello mobile senza indizio.** La foto riempiva tutta la larghezza: non si capiva che si poteva scorrere. Altezza ridotta perché si veda il bordo della successiva.
5. **Fascia di tinta sopra le copertine orizzontali**: sembrava una riga di separazione. Tolta: la foto apre il capitolo, la tinta sta sotto, intorno al testo.

**Giro 2**

6. **Orizzontale sospesa nel vuoto** (mobile): limitata in larghezza, la foto restava piccola in un riquadro alto. Solo nella striscia di benvenuto e solo sotto i 760 px, le orizzontali si inquadrano in 4:5 sul punto focale scelto da Irene nel CMS. Nel carosello degli album non si ritaglia mai.

**Elemento tolto:** la frase sotto la striscia di benvenuto ("Sport da vicino…"). Ripeteva la presentazione di poche righe sotto. Il campo `fraseBenvenuto` resta facoltativo nel CMS e nel precaricamento si lascia vuoto.

**Esito:** a 1440 px la home si legge come una sequenza di tavole: striscia di foto, la persona, tre capitoli ognuno nel suo colore. A 390 px la prima schermata è una foto piena e i capitoli diventano foto e testo in colonna. La pagina album prende il blu della copertina su tutta la superficie e cambia colore solo nella fascia dell'album successivo. Da verificare nel sito vero: visore a tutto schermo, View Transition, hotspot.
