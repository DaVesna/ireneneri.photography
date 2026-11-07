// Carica su Sanity le foto preparate e crea i documenti del precaricamento.
//
//   npm run foto:importa -- --prova        mostra cosa farebbe, senza scrivere nulla
//   npm run foto:importa                   import vero
//   npm run foto:importa -- --sovrascrivi  sostituisce anche i documenti già esistenti
//
// - ID deterministici: categoria-<slug>, album-<slug>, e ID fissi per i documenti singoli.
// - Rilanciabile: le immagini già caricate vengono riconosciute (registro locale + controllo su
//   Sanity) e i documenti esistenti non vengono toccati, così le modifiche fatte da Irene nello
//   Studio non si perdono. Con --sovrascrivi i documenti vengono ricreati.
// - Ripresa: il registro delle immagini caricate si aggiorna dopo ogni caricamento.
// - I documenti vengono creati già pubblicati, perché il sito legge solo i contenuti pubblicati.
import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@sanity/client'
import { RADICE_REPO } from './lib/percorsi.mjs'
import { leggiPiano } from './lib/piano.mjs'
import { formattaPeso } from './lib/file.mjs'

const PREPARATE = path.join(RADICE_REPO, 'src', 'photos', 'preparate')
const REGISTRO = path.join(PREPARATE, 'registro-import.json')
const PROVA = process.argv.includes('--prova')
const SOVRASCRIVI = process.argv.includes('--sovrascrivi')

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN } = process.env
if (!SANITY_PROJECT_ID || !SANITY_DATASET || (!PROVA && !SANITY_WRITE_TOKEN)) {
  console.error(
    'Mancano SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN nel file .env (vedi .env.example).',
  )
  process.exit(1)
}
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_WRITE_TOKEN,
  apiVersion: '2026-11-01',
  useCdn: false,
})

const piano = await leggiPiano()

// ---------------------------------------------------------------- testi del precaricamento
const DA_FORNIRE = (/** @type {string} */ s) => `[DA FORNIRE: ${s}]`

/** Paragrafi di testo semplice in Portable Text, con chiavi stabili. @param {string[]} paragrafi @param {string} prefisso */
function blocchi(paragrafi, prefisso) {
  return paragrafi.map((testo, i) => ({
    _type: 'block',
    _key: `${prefisso}${i + 1}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${prefisso}${i + 1}s`, text: testo, marks: [] }],
  }))
}

/** Testi alternativi delle foto di benvenuto (le copertine hanno il loro nel piano). */
const ALT_BENVENUTO = /** @type {Record<string, string>} */ ({
  'piero-13.jpg': 'La sala pesi vista attraverso un anello da ginnastica',
  'teatro-di-monfalcone-10.jpg':
    'Due ballerine in una figura di coppia sul palo, sotto luci di scena blu',
  'cata-e-alice-05.jpg':
    'Ballerina sul palo in bianco e nero, con una gamba tesa verso la finestra',
  'elisa-07.jpg': 'Elisa sospesa in orizzontale al palo, in una sala chiara',
  'no-border-village-10.jpg': 'Ballerina inarcata all’indietro accanto al palo, all’aperto',
  'mika-05.jpg': 'Mika in fondo a una fila di rack, nella palestra',
  'boxe-01.jpg': 'Pugile con il caschetto che colpisce, in bianco e nero',
})
const CONDIVISIONE = 'teatro-di-monfalcone-02.jpg'

// ---------------------------------------------------------------- immagini
/** @type {Record<string, string>} file relativo → ID asset */
let registro = {}
try {
  registro = JSON.parse(await fs.readFile(REGISTRO, 'utf8'))
} catch {
  registro = {}
}

let caricate = 0
let riusate = 0
let pesoDaCaricare = 0

/** Carica (o ritrova) un'immagine preparata e restituisce l'ID dell'asset. @param {string} rel */
async function asset(rel) {
  const file = path.join(PREPARATE, rel)
  const noto = registro[rel]
  if (noto) {
    if (PROVA) {
      riusate++
      return noto
    }
    const esiste = await client.fetch('defined(*[_id == $id][0]._id)', { id: noto })
    if (esiste) {
      riusate++
      return noto
    }
  }
  const peso = (await fs.stat(file)).size
  pesoDaCaricare += peso
  if (PROVA) {
    caricate++
    registro[rel] = `image-prova-${rel}`
    return registro[rel]
  }
  const a = await client.assets.upload('image', await fs.readFile(file), {
    filename: path.basename(rel),
    preserveFilename: false,
    contentType: 'image/jpeg',
    extract: ['lqip', 'palette'],
  })
  registro[rel] = a._id
  await fs.writeFile(REGISTRO, JSON.stringify(registro, null, 2))
  caricate++
  return a._id
}

/** @param {string} id @param {string} tipo @param {string} [alt] */
const immagine = (id, tipo, alt) => ({
  _type: tipo,
  ...(alt ? { alt } : {}),
  asset: { _type: 'reference', _ref: id },
})

/** @param {string} nome es. "piero-13.jpg" */
const relDaNome = (nome) => `${nome.replace(/-\d+\.jpg$/, '')}/${nome}`

// ---------------------------------------------------------------- documenti
/** @type {import('@sanity/client').IdentifiedSanityDocumentStub[]} */
const documenti = []

for (const c of piano.categorie) {
  documenti.push({
    _id: `categoria-${c.slug}`,
    _type: 'categoria',
    titolo: c.titolo,
    slug: { _type: 'slug', current: c.slug },
    ordine: c.ordine,
  })
}

let passo = 0
for (const a of piano.album) {
  passo++
  const cartella = path.join(PREPARATE, a.slug)
  const nomi = (await fs.readdir(cartella)).filter((f) => f.endsWith('.jpg')).sort()
  /** @type {any[]} */
  const foto = []
  for (const [i, nome] of nomi.entries()) {
    const id = await asset(`${a.slug}/${nome}`)
    foto.push({ _key: `f${String(i + 1).padStart(2, '0')}`, ...immagine(id, 'fotoAlbum') })
    process.stdout.write(
      `\r[${passo}/${piano.album.length}] ${a.titolo.padEnd(22)} ${i + 1}/${nomi.length} `,
    )
  }
  process.stdout.write('\n')
  if (!a.copertina) throw new Error(`Copertina mancante per ${a.slug}`)
  const copertina = await asset(relDaNome(a.copertina))
  documenti.push({
    _id: `album-${a.slug}`,
    _type: 'album',
    titolo: a.titolo,
    slug: { _type: 'slug', current: a.slug },
    categoria: { _type: 'reference', _ref: `categoria-${a.categoria}` },
    data: /** @type {any} */ (a).data,
    ...(a.luogo ? { luogo: a.luogo } : {}),
    copertina: immagine(copertina, 'immagineConAlt', a.alt),
    testo: blocchi(a.testo ?? [], 't'),
    foto,
  })
}

const benvenuto = []
for (const [i, nome] of (piano.benvenuto ?? []).entries()) {
  const id = await asset(relDaNome(nome))
  benvenuto.push({
    _key: `b${i + 1}`,
    ...immagine(id, 'immagineConAlt', ALT_BENVENUTO[nome] ?? 'Foto di Irene Neri'),
  })
}
documenti.push({
  _id: 'home',
  _type: 'home',
  invito: 'Per un servizio, una gara o anche solo una domanda, scrivimi.',
  fotoBenvenuto: benvenuto,
  albumInEvidenza: (piano.inEvidenza ?? []).map((slug, i) => ({
    _key: `e${i + 1}`,
    _type: 'reference',
    _ref: `album-${slug}`,
  })),
})

const ritratto = await asset('ritratto-segnaposto.jpg')
documenti.push({
  _id: 'chiSono',
  _type: 'chiSono',
  titolo: 'Chi sono',
  presentazioneBreve:
    'Sono Irene, fotografa. Qui trovi i miei lavori più recenti: soprattutto sport, tra pole dance, palestra e boxe.',
  testo: blocchi(
    [
      'Sono Irene Neri e mi occupo soprattutto di fotografia sportiva: spettacoli e sessioni di pole dance, allenamenti in palestra, incontri di boxe.',
      DA_FORNIRE(
        'due o tre frasi di Irene su come lavora, da quanto tempo fotografa e in quale zona',
      ),
      'Se vuoi organizzare un servizio o hai una domanda, scrivimi dalla pagina Contatti.',
    ],
    'c',
  ),
  ritratto: immagine(
    ritratto,
    'immagineConAlt',
    'Segnaposto grigio con la scritta: ritratto da sostituire',
  ),
})
documenti.push({
  _id: 'contatti',
  _type: 'contatti',
  testoIntroduttivo: 'Per un servizio, una gara o una domanda, scrivimi con il modulo qui sotto.',
  emailPubblica: DA_FORNIRE('email pubblica di Irene'),
  instagram: DA_FORNIRE('indirizzo del profilo Instagram'),
})
documenti.push({
  _id: 'privacy',
  _type: 'privacy',
  titolo: 'Informativa privacy',
  testo: blocchi([DA_FORNIRE('informativa privacy')], 'p'),
})
const condivisione = await asset(relDaNome(CONDIVISIONE))
documenti.push({
  _id: 'impostazioni',
  _type: 'impostazioni',
  nomeSito: 'Irene Neri, fotografa',
  descrizione: 'Fotografie di Irene Neri: sport, pole dance, palestra e boxe.',
  immagineCondivisione: immagine(
    condivisione,
    'immagineConAlt',
    piano.album.find((a) => a.slug === 'teatro-di-monfalcone')?.alt,
  ),
  testoPiede: 'Irene Neri, fotografa',
})

// ---------------------------------------------------------------- scrittura
const esistenti = PROVA
  ? new Set()
  : new Set(await client.fetch('*[_id in $ids]._id', { ids: documenti.map((d) => d._id) }))

console.log(
  `\nImmagini: ${caricate} ${PROVA ? 'da caricare' : 'caricate'} (${formattaPeso(pesoDaCaricare)}), ${riusate} già presenti.`,
)
const tx = client.transaction()
let creati = 0
let saltati = 0
for (const d of documenti) {
  if (esistenti.has(d._id) && !SOVRASCRIVI) {
    saltati++
    console.log(`  già presente, non toccato: ${d._id}`)
    continue
  }
  if (SOVRASCRIVI) tx.createOrReplace(d)
  else tx.createIfNotExists(d)
  creati++
  if (PROVA)
    console.log(`  ${esistenti.has(d._id) ? 'sostituirebbe' : 'creerebbe'}: ${d._id} (${d._type})`)
}
if (PROVA) {
  console.log(
    `\nProva: ${creati} documenti da scrivere, ${saltati} da lasciare. Nessuna scrittura eseguita.`,
  )
} else {
  if (creati) await tx.commit()
  console.log(`Documenti: ${creati} scritti, ${saltati} lasciati com'erano.`)
}
