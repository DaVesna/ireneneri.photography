// Prova del modello dei contenuti senza Studio: crea un album di prova con 3 immagini generate,
// ne inverte l'ordine, poi elimina documento e immagini. Non tocca altri contenuti.
//
//   node --env-file=.env scripts/prova-album.mjs
import sharp from 'sharp'
import { createClient } from '@sanity/client'

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN } = process.env
if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_WRITE_TOKEN) {
  console.error('Mancano SANITY_PROJECT_ID, SANITY_DATASET o SANITY_WRITE_TOKEN nel file .env')
  process.exit(1)
}
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_WRITE_TOKEN,
  apiVersion: '2026-11-01',
  useCdn: false,
})

const ID = 'drafts.album-prova-studio'
const colori = ['#5a4636', '#36475a', '#3f5a36']
const asset = []
for (const [i, c] of colori.entries()) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="100%" height="100%" fill="${c}"/><text x="450" y="330" font-size="90" text-anchor="middle" fill="#eee" font-family="sans-serif">Prova ${i + 1}</text></svg>`
  const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toBuffer()
  const a = await client.assets.upload('image', buf, { filename: `prova-${i + 1}.jpg` })
  asset.push(a)
}
console.log(
  'Caricate 3 immagini:',
  asset.map((a) => `${a.metadata?.dimensions?.width}x${a.metadata?.dimensions?.height}`).join(', '),
)
console.log('Metadati estratti:', Object.keys(asset[0]?.metadata ?? {}).join(', '))

const foto = asset.map((a, i) => ({
  _key: `f${i + 1}`,
  _type: 'fotoAlbum',
  asset: { _type: 'reference', _ref: a._id },
}))
await client.createOrReplace({
  _id: ID,
  _type: 'album',
  titolo: 'Album di prova',
  slug: { _type: 'slug', current: 'album-di-prova' },
  data: '2026-11-07',
  copertina: {
    _type: 'immagineConAlt',
    alt: 'Prova',
    asset: { _type: 'reference', _ref: asset[0]?._id },
  },
  foto,
})
console.log(
  'Creato:',
  (await client.getDocument(ID))?.foto.map((/** @type {any} */ f) => f._key).join(' '),
)

await client
  .patch(ID)
  .set({ foto: [...foto].reverse() })
  .commit()
console.log(
  'Riordinato:',
  (await client.getDocument(ID))?.foto.map((/** @type {any} */ f) => f._key).join(' '),
)

// Il dataset pubblico non deve mostrare la bozza a chi legge senza token.
const anonimo = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-11-01',
  useCdn: false,
  perspective: 'published',
})
const visibili = await anonimo.fetch(
  'count(*[_type == "album" && slug.current == "album-di-prova"])',
)
console.log('Visibile senza token (deve essere 0):', visibili)

await client.delete(ID)
for (const a of asset) await client.delete(a._id)
const resti = await client.fetch('count(*[_id == $id || _id in $asset])', {
  id: ID,
  asset: asset.map((a) => a._id),
})
console.log('Eliminato documento e immagini; resti:', resti)
