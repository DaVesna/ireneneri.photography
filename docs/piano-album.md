# Piano degli album

> Questo è il piano del primo caricamento (7 novembre 2026). Da allora il CMS è la fonte di verità: per esempio "Cata e Alice" è stato rinominato "Catarina e Alice" e le foto di benvenuto sono cambiate nello Studio.

Fonte per gli script: `scripts/dati/album.json`. Copia di lavoro: `src/photos/backup/album/<slug>/`, con `elenco.json` che lega ogni nome nuovo al file originale.

## Regole

- Un album = una cartella foglia dell'originale = un evento o una sessione. Nessuna sezione interna: nessuna cartella foglia contiene sottogruppi.
- Ordine delle foto: cronologico per data di scatto EXIF; a parità di ora, per nome del file. Il numero nel nome della copia (`<slug>-01.jpg`, `-02`…) fissa l'ordine.
- Data dell'album: giorno del primo scatto.
- Luogo: solo se risulta dal nome della cartella.
- Categorie dalle cartelle di primo livello: `sport` → Sport, `people` → Persone, `pets` → Animali, `events` → Eventi. Persone, Animali ed Eventi per ora non hanno album veri.

## Album

| Cartella originale | Album | Slug | Categoria | Data | Luogo | Foto | Copertina |
|---|---|---|---|---|---|---:|---|
| `sport/WTA/Mika` | Mika | `mika` | Sport | 2026-02-07 | WTA | 10 | n. 8 (`IGN_1695-2.jpg`) |
| `sport/WTA/Piero` | Piero | `piero` | Sport | 2026-02-07 | WTA | 23 | n. 13 (`IGN_1719.jpg`) |
| `sport/Pole Dance/Cata e Alice` | Cata e Alice | `cata-e-alice` | Sport | 2026-02-14 | — | 7 | n. 2 (`IGN_1818.jpg`) |
| `sport/Pole Dance/Elisa` | Elisa | `elisa` | Sport | 2026-03-21 | — | 10 | n. 7 (`IGN_1970-2.jpg`) |
| `sport/Pole Dance/Teatro Monfalcone` | Teatro di Monfalcone | `teatro-di-monfalcone` | Sport | 2026-03-22 | Monfalcone | 10 | n. 2 (`IGN_2381.jpg`) |
| `sport/Pole Dance/No border Village` | No Border Village | `no-border-village` | Sport | 2026-05-09 | — | 13 | n. 2 (`IGN_3089-2.jpg`) |
| `sport/Boxe` | Boxe | `boxe` | Sport | 2013-07-19 | — | 1 | n. 1 (`IGN_1986-2.jpg`) |

## Cartelle escluse

- `events/matrimonio-anna-e-luca`: immagini segnaposto sfocate (18 KB, senza EXIF), non foto di Irene. Il `meta.json` che contengono (luogo, data, testo) non viene usato perché descrive foto che non esistono.
- `pets/nina-e-il-prato`: immagini segnaposto sfocate (18 KB, senza EXIF), non foto di Irene. Il `meta.json` che contengono (luogo, data, testo) non viene usato perché descrive foto che non esistono.
- `people/`: vuota.

## Foto di benvenuto per la home

Sette foto, due orizzontali e cinque verticali, da sette album diversi; nessuna è copertina di un album in evidenza (rivisto in M3):

1. Piero, foto n. 13 (orizzontale)
1. Teatro di Monfalcone, foto n. 10 (verticale)
1. Cata e Alice, foto n. 5 (verticale)
1. Elisa, foto n. 7 (orizzontale)
1. No Border Village, foto n. 10 (verticale)
1. Mika, foto n. 5 (verticale)
1. Boxe, foto n. 1 (verticale)

## Album in evidenza nella home

- Teatro di Monfalcone
- Cata e Alice
- No Border Village

## Testi degli album

Scritti dai provini e dalle date EXIF, senza aggiungere nomi, luoghi o fatti non verificabili.

**Mika** — Mika si allena nella palestra WTA: squat con il bilanciere, panca, esercizi ai cavi. Le foto seguono la sessione dall'inizio alla fine, in una mezz'ora di febbraio.

Testo alternativo della copertina: Mika tira un cavo con le due mani davanti al logo della palestra

**Piero** — Piero e la palestra WTA, in due mattine di febbraio. Prima gli spazi vuoti, con i rack in fila e gli anelli appesi. Poi il lavoro con chi si allena: stacchi da terra, mobilità, correzioni da vicino.

Testo alternativo della copertina: La sala pesi vista attraverso un anello da ginnastica

**Cata e Alice** — Pole dance in bianco e nero, davanti a una finestra che fa da unica luce. Figure tenute, prese a testa in giù, linee lunghe di braccia e gambe.

Testo alternativo della copertina: Figura a testa in giù sul palo, in controluce davanti a una finestra

**Elisa** — Una mattina in sala con Elisa, tra pole dance e luce chiara. Una gonna rossa per le prime figure, poi body scuri e posizioni sempre più staccate da terra.

Testo alternativo della copertina: Elisa sospesa in orizzontale al palo, in una sala chiara

**Teatro di Monfalcone** — Pole dance sul palco del teatro di Monfalcone, con la band che suona alle spalle. Assoli e un duo, sotto luci di scena basse e colorate.

Testo alternativo della copertina: Ballerina in spaccata sul palo, con la band sul palco alle spalle

**No Border Village** — Esibizioni di pole dance all'aperto, su una pedana rotonda montata in un campo da basket. Luce di fine giornata, biciclette e panche sullo sfondo, un quarto d'ora di foto.

Testo alternativo della copertina: Ballerina inclinata sul palo all'aperto, in un campo da basket

**Boxe** — Uno scatto da un incontro di boxe del 2013, in bianco e nero. Un pugno appena partito, visto dal basso, con le corde del ring in primo piano.

Testo alternativo della copertina: Pugile con il caschetto che colpisce, in bianco e nero

## Note sulla qualità

- Elisa: le foto n. 1, 2, 3, 10 (667×1000 px) e n. 5 (1498×1000 px) sono a bassa risoluzione. A tutto schermo risulteranno morbide: servono gli originali ad alta risoluzione.
- Boxe: un album con una sola foto. Il carosello deve funzionare anche così.
- Mika e Piero: alcune foto superano i 14000 px (probabile ingrandimento in post-produzione); vengono ridotte a 3200 px prima del caricamento.
