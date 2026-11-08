# Direzione visiva — versione 2

La versione 1 (fondo scuro, tinte piene, titoli stretti) è stata scartata: vedi `docs/direzione-visiva-v1.md`. Questa versione parte dai riferimenti scelti da Davide l'8 novembre 2026, dalla firma di Irene e dal font Work Sans. Screenshot in `screenshots/riferimenti2/` (esclusa da git).

## 1. Cosa prendiamo dai riferimenti

### fionanoever.de — il modello principale ("bello nel complesso")

- **Struttura.** Apertura a tutto schermo con foto che si alternano (bianco e nero, leggermente scurite), il menu bianco sopra la foto, una frase al centro. Poi un ritratto rotondo della fotografa con tre righe in prima persona e un pulsante "chi sono". Poi un capitolo per ogni sport: una fascia larga quanto lo schermo con una foto in parallasse e il nome dello sport in un pulsante con il bordo, seguita da una fila di tre foto verticali.
- **Tono.** Fondo bianco sporco (`#f4f5f3`), grigio ardesia per fasce e piede (`#3c3b38`), Work Sans leggero (200–300). Foto forti, testo poco e chiaro.
- **Movimento.** Foto dell'apertura che si dissolvono una nell'altra; sfondi delle fasce in parallasse; le foto entrano con una dissolvenza dal basso mentre si scorre.
- **Da prendere:** fondo chiaro, Work Sans leggero, apertura a foto alternate, ritratto rotondo con presentazione, capitoli "fascia + fila di foto", entrate morbide.
- **Da evitare:** le animazioni d'entrata su tutto e la frase in inglese di maniera; il menu a tendina per ogni sport.

### agatiandrea.com — la composizione ("animazioni un po' invadenti")

- **Struttura.** Nome grande sull'apertura; "chi sono" in due colonne (testo e foto affiancati); servizi come grandi riquadri foto con il titolo sopra; portfolio filtrabile per categoria con schede di testo (Ritratti, Aziende, Pet, Concerti).
- **Movimento.** Ogni blocco entra da una direzione diversa (sinistra, destra, alto, basso): è proprio quello che lo rende invadente.
- **Da prendere:** "chi sono" a due colonne, filtro del portfolio come schede di testo, titoli sopra le foto nei riquadri dell'elenco.
- **Da evitare:** entrate da direzioni diverse, loghi dei clienti, recensioni.

### codeeritratti.com — il clima ("vivace, bel mood"; font bocciato)

- **Struttura.** Mosaico di foto di misure diverse, alcune grandi e altre piccole, che si incastrano; colori pieni, animali in posa con carattere.
- **Da prendere:** il mosaico a misure diverse per l'elenco degli album, l'allegria delle foto in primo piano.
- **Da evitare:** il font (Garamond e Raleway mescolati, scritte su ogni fascia), i colori di sfondo saturi, i badge "prenota ora".

### La firma di Irene

"IreneNerI ph." in corsivo con due frecce a cerchio e la riga "SPORT, PET, PORTRAIT PHOTOGRAPHY". È il marchio vero: nero su chiaro, bianco sulle foto (stesso file trasparente, invertito via CSS). Versione completa per l'apertura della home e il piede; versione con il solo corsivo nella testata. Il corsivo della firma è l'unico elemento "a mano" del sito: tutto il resto è Work Sans.

## 2. Principi

1. **Le foto a tutto campo, il testo quieto.** Foto larghe quanto lo schermo dove serve emozione (apertura, capitoli, apertura dell'album); per il resto fondo chiaro e molto spazio.
2. **Chiaro e caldo, non asettico.** Fondo bianco sporco, mai bianco puro; fasce e piede in grigio ardesia, mai nero puro. Il calore viene dalle foto, dal ritratto rotondo di Irene e dalla sua firma.
3. **Movimento sì, ma lento e uguale per tutto.** Una sola famiglia di movimenti: dissolvenza, piccola salita, parallasse leggera. Mai entrate da direzioni diverse.
4. **Ogni album ha il suo tono**, in versione chiara: lo sfondo della pagina album prende una velatura del colore della copertina.
5. **Il punto focale decide** ogni inquadratura (cerchio del ritratto, fasce, riquadri del mosaico).

## 3. Palette

| Ruolo | Nome | Hex | Contrasto |
|---|---|---|---|
| Fondo | Carta | `#f3f2ee` | — |
| Testo | Inchiostro | `#1f1e1c` | 14,9:1 su Carta |
| Testo secondario | Grafite | `#5c5853` | 6,3:1 su Carta |
| Fasce, piede, pulsanti pieni | Ardesia | `#3b3936` | 10,3:1 con Carta |
| Visore | Notte | `#161514` | — |
| Velatura album | dalla copertina | L 0,955, croma ≤ 0,02 | Inchiostro ≥ 13:1 |

## 4. Tipografia

Work Sans (variabile, pesi 100–900, licenza OFL), servito dal sito, solo latino e latino esteso.

| Ruolo | Impostazioni |
|---|---|
| Titoli grandi (album, capitoli, pagine) | peso 300, `clamp(2.4rem, 6vw, 5.5rem)`, interlinea 1,05 |
| Presentazione e testi d'introduzione | peso 300, 1,25–1,4rem, interlinea 1,6 |
| Testo | peso 400, 1,0625rem, interlinea 1,7 |
| Menu e pulsanti | peso 500, maiuscolo, spaziatura 0,18em, 0,8rem (come la riga della firma) |

Il maiuscolo spaziato si usa solo per menu e pulsanti, cioè dove riprende la riga della firma; non sopra i titoli.

## 5. Pagine

**Home**

```
┌──────────────────────────────────────────────┐
│                     ALBUM  CHI SONO  CONTATTI │  menu bianco sopra la foto
│                                              │
│              IreneNerI ph.  (firma bianca)   │  apertura a tutto schermo:
│        SPORT, PET, PORTRAIT PHOTOGRAPHY      │  foto di benvenuto che si
│                                       [❚❚]   │  dissolvono, zoom lentissimo
├──────────────────────────────────────────────┤
│                 ( ritratto )                 │  ritratto rotondo
│     Sono Irene, fotografa. Qui trovi…        │  presentazione breve
│                 [ CHI SONO ]                 │
├──────────────────────────────────────────────┤
│▓▓▓▓▓▓▓▓▓▓▓ copertina in parallasse ▓▓▓▓▓▓▓▓▓▓│  capitolo: fascia con titolo
│▓▓▓▓▓▓▓▓▓  Teatro di Monfalcone  ▓▓▓▓▓▓▓▓▓▓▓▓│  e pulsante bianco
│▓▓▓▓▓▓▓▓▓▓▓  [ GUARDA L'ALBUM ]  ▓▓▓▓▓▓▓▓▓▓▓▓│
│   ┌──────┐  ┌──────┐  ┌──────┐               │  tre foto dell'album che
│   │      │  │      │  │      │               │  entrano mentre si scorre
│   └──────┘  └──────┘  └──────┘               │
├──────────────────────────────────────────────┤
│▒▒▒ Per un servizio… scrivimi. [ CONTATTI ] ▒▒│  fascia ardesia
│▒▒▒ firma bianca · menu · Instagram · Privacy ▒│  piede
└──────────────────────────────────────────────┘
```

**Album (elenco):** titolo, filtro a schede di testo (Tutti / categorie / anni), mosaico di copertine a misure diverse (verticali alte due righe, orizzontali larghe due colonne), titolo e data sopra la foto su una sfumatura scura; al passaggio la foto si avvicina appena.

**Pagina album:** sfondo con la velatura della copertina; copertina a tutta larghezza (85vh) in parallasse leggera con titolo bianco in basso a sinistra; data, luogo e testo centrati in colonna stretta; galleria a righe giustificate (ogni foto alla sua proporzione, nessun ritaglio), clic → visore a tutto schermo; in fondo la fascia dell'album successivo con la sua copertina.

**Chi sono:** due colonne (ritratto e testo), una sola su mobile.

**Contatti:** colonna centrale con testo, recapiti e modulo.

## 6. Movimento

| Dove | Cosa | Tecnica |
|---|---|---|
| Apertura della home | dissolvenza tra le foto ogni 6 s, zoom 1 → 1,06 molto lento, pulsante pausa | piccolo script; le foto successive si caricano solo poco prima di comparire |
| Fasce dei capitoli, apertura dell'album, album successivo | parallasse leggera (±6%) | animazioni CSS legate allo scorrimento (`animation-timeline: view()`) |
| Foto dei capitoli, mosaico, galleria | dissolvenza con salita di 24 px, una volta | stesse animazioni CSS; dove il browser non le supporta le foto sono semplicemente ferme e visibili |
| Mosaico | avvicinamento dell'immagine al passaggio del mouse | transizione CSS |

Con `prefers-reduced-motion: reduce`: nessuna dissolvenza automatica (si vede la prima foto, il pulsante diventa "avanti"), nessuno zoom, nessuna parallasse, nessuna entrata.

**Scostamento consapevole da `CLAUDE.md`:** la regola chiedeva un solo movimento orchestrato e nessuna animazione d'entrata ricorrente. Davide ha scelto come riferimento principale un sito con apertura animata ed entrate morbide, chiedendo di prenderne spunto. Le teniamo, ma tutte della stessa famiglia, lente, una volta sola, senza nascondere contenuti a chi non ha le animazioni, e spente con reduced-motion.

## 7. Revisione contro il brief

| Punto | Esito |
|---|---|
| Mai bianco né nero puro | Carta `#f3f2ee`, Ardesia `#3b3936`, Notte `#161514` |
| Fondo crema + serif + terracotta | No: fondo neutro, nessun serif, nessun accento terracotta |
| Maiuscolo spaziato sopra ogni titolo | No: solo menu e pulsanti, come la riga della firma |
| Metadati con puntini, frecce →, numerazioni finte | No |
| Card tutte uguali con la stessa ombra | No: mosaico a misure diverse, nessuna ombra |
| Decorazioni finto-artigianali | No: l'unico corsivo è la firma vera di Irene |
| Foto non deformate né ritagliate a caso | Galleria senza ritagli; dove si inquadra (cerchio, fasce, mosaico) decide il punto focale |
| Font in locale | Work Sans da Fontsource, servito dal sito |
| Una cosa coraggiosa per pagina | Home: l'apertura animata. Album: la copertina a tutta larghezza. Elenco: il mosaico |
