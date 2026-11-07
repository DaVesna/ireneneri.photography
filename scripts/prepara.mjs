// Prepara le foto da caricare su Sanity, a partire dalla copia di lavoro.
//
//   npm run foto:prepara
//
// Per ogni foto: orientamento applicato, lato lungo massimo 3200 px, sRGB, JPEG qualità 88,
// nessun metadato (EXIF, GPS, profilo, XMP). Output in src/photos/preparate/<slug>/ (fuori da git).
// Genera anche il ritratto segnaposto. Alla fine verifica un campione e stampa il peso totale.
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import exifr from 'exifr'
import { RADICE_REPO } from './lib/percorsi.mjs'
import { leggiPiano, cartellaLavoro } from './lib/piano.mjs'
import { formattaPeso } from './lib/file.mjs'

export const PREPARATE = path.join(RADICE_REPO, 'src', 'photos', 'preparate')
const LATO_MAX = 3200
const QUALITA = 88
const LIMITE_TOTALE = 10 * 1024 ** 3

sharp.cache(false)

/** @param {string} da @param {string} a */
async function prepara(da, a) {
  // sharp di default non copia i metadati nell'output: niente EXIF, GPS, XMP né profilo ICC.
  // toColorspace('srgb') converte dal profilo incorporato (per esempio Adobe RGB) a sRGB.
  return sharp(da)
    .rotate()
    .resize(LATO_MAX, LATO_MAX, { fit: 'inside', withoutEnlargement: true })
    .toColorspace('srgb')
    .jpeg({ quality: QUALITA, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(a)
}

/** Nessun metadato rimasto nel file? @param {string} file */
async function senzaMetadati(file) {
  const m = await sharp(file).metadata()
  const exif = await exifr
    .parse(file, { tiff: true, exif: true, gps: true, xmp: true, iptc: true })
    .catch(() => null)
  return !m.exif && !m.xmp && !m.iptc && !m.icc && (exif == null || Object.keys(exif).length === 0)
}

const piano = await leggiPiano()
await fs.mkdir(PREPARATE, { recursive: true })
let totale = 0
let n = 0
/** @type {string[]} */
const tutte = []
for (const album of piano.album) {
  const da = cartellaLavoro(album.slug)
  const a = path.join(PREPARATE, album.slug)
  await fs.mkdir(a, { recursive: true })
  const nomi = (await fs.readdir(da)).filter((f) => f.endsWith('.jpg')).sort()
  for (const nome of nomi) {
    const out = path.join(a, nome)
    const gia = await fs.stat(out).catch(() => null)
    const orig = await fs.stat(path.join(da, nome))
    if (!gia || gia.mtimeMs < orig.mtimeMs) await prepara(path.join(da, nome), out)
    totale += (await fs.stat(out)).size
    tutte.push(out)
    n++
  }
  process.stdout.write(`${album.slug.padEnd(24)} ${nomi.length} foto\n`)
}

// Ritratto segnaposto: un'immagine neutra, mai la foto di un'altra persona.
const ritratto = path.join(PREPARATE, 'ritratto-segnaposto.jpg')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2000">
  <rect width="100%" height="100%" fill="#2a2724"/>
  <text x="800" y="980" font-family="sans-serif" font-size="88" fill="#a8a199" text-anchor="middle">Ritratto</text>
  <text x="800" y="1090" font-family="sans-serif" font-size="88" fill="#a8a199" text-anchor="middle">da sostituire</text>
</svg>`
await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(ritratto)
totale += (await fs.stat(ritratto)).size

// Verifica su un campione: una foto ogni 6, più la prima e l'ultima.
const campione = tutte.filter((_, i) => i % 6 === 0 || i === tutte.length - 1)
const conMetadati = []
for (const f of campione) {
  if (!(await senzaMetadati(f))) conMetadati.push(path.relative(PREPARATE, f))
  const m = await sharp(f).metadata()
  if (Math.max(m.width ?? 0, m.height ?? 0) > LATO_MAX)
    conMetadati.push(`${f}: oltre ${LATO_MAX} px`)
}
if (conMetadati.length) {
  console.error('ERRORE: metadati o dimensioni non conformi in', conMetadati.join(', '))
  process.exit(1)
}

console.log(
  `\n${n} foto preparate in ${path.relative(RADICE_REPO, PREPARATE)}, più il ritratto segnaposto.`,
)
console.log(
  `Verifica su ${campione.length} foto di campione: nessun metadato EXIF, GPS, XMP, IPTC o ICC; lato lungo ≤ ${LATO_MAX} px.`,
)
console.log(`Peso totale da caricare: ${formattaPeso(totale)}.`)
if (totale > LIMITE_TOTALE) {
  console.error('STOP: oltre 10 GB. Punto di blocco: chiedere a Davide prima di importare.')
  process.exit(2)
}
