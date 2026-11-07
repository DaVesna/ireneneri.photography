// Prepara il prototipo statico: immagini ridotte dalla copia di lavoro, tinte, font.
//   node prototipo/prepara.mjs
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { tintaDaColore, hexToOklch } from '../web/src/lib/tinta.js'

const QUI = path.dirname(fileURLToPath(import.meta.url))
const COPIA = path.join(QUI, '..', 'src', 'photos', 'backup', 'album')
const FOTO = path.join(QUI, 'foto')
const FONT = path.join(QUI, 'font')
await fs.mkdir(FOTO, { recursive: true })
await fs.mkdir(FONT, { recursive: true })

const benvenuto = [
  'piero-13',
  'teatro-di-monfalcone-10',
  'cata-e-alice-05',
  'elisa-07',
  'no-border-village-10',
  'mika-05',
  'boxe-01',
]
const capitoli = [
  {
    slug: 'teatro-di-monfalcone',
    titolo: 'Teatro di Monfalcone',
    data: '22 marzo 2026',
    luogo: 'Monfalcone',
    copertina: 'teatro-di-monfalcone-02',
    foto: 10,
    testo: 'Pole dance sul palco del teatro di Monfalcone, con la band che suona alle spalle.',
  },
  {
    slug: 'cata-e-alice',
    titolo: 'Cata e Alice',
    data: '14 febbraio 2026',
    copertina: 'cata-e-alice-02',
    foto: 7,
    testo: 'Pole dance in bianco e nero, davanti a una finestra che fa da unica luce.',
  },
  {
    slug: 'no-border-village',
    titolo: 'No Border Village',
    data: '9 maggio 2026',
    copertina: 'no-border-village-02',
    foto: 13,
    testo:
      'Esibizioni di pole dance all’aperto, su una pedana rotonda montata in un campo da basket.',
  },
]
const album = 'no-border-village'

/** @param {string} nome @param {number} lato */
async function riduci(nome, lato) {
  const slug = nome.replace(/-\d+$/, '')
  const out = path.join(FOTO, `${nome}-${lato}.jpg`)
  const info = await sharp(path.join(COPIA, slug, `${nome}.jpg`))
    .rotate()
    .resize(lato, lato, { fit: 'inside' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out)
  return { src: `foto/${nome}-${lato}.jpg`, w: info.width, h: info.height }
}

/** Colore "vibrante" approssimato: media dei pixel più saturi a luminosità media. @param {string} nome */
async function coloreCopertina(nome) {
  const slug = nome.replace(/-\d+$/, '')
  const { data } = await sharp(path.join(COPIA, slug, `${nome}.jpg`))
    .resize(96, 96, { fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true })
  /** @type {{hex: string, L: number, C: number}[]} */
  const px = []
  for (let i = 0; i < data.length; i += 3) {
    const hex =
      '#' +
      [data[i], data[i + 1], data[i + 2]]
        .map((v) => (v ?? 0).toString(16).padStart(2, '0'))
        .join('')
    const [L, C] = hexToOklch(hex)
    if (L > 0.2 && L < 0.75) px.push({ hex, L, C })
  }
  px.sort((a, b) => b.C - a.C)
  const top = px.slice(0, Math.max(1, Math.floor(px.length * 0.15)))
  const m = [1, 3, 5].map((k) =>
    Math.round(top.reduce((s, p) => s + parseInt(p.hex.slice(k, k + 2), 16), 0) / top.length),
  )
  return '#' + m.map((v) => v.toString(16).padStart(2, '0')).join('')
}

const dati = {
  benvenuto: /** @type {any[]} */ ([]),
  capitoli: /** @type {any[]} */ ([]),
  album: /** @type {any} */ (null),
}
for (const n of benvenuto) dati.benvenuto.push(await riduci(n, 1400))
for (const c of capitoli) {
  const colore = await coloreCopertina(c.copertina)
  dati.capitoli.push({
    ...c,
    img: await riduci(c.copertina, 1800),
    colore,
    tinta: tintaDaColore(colore),
  })
}
const nomi = (await fs.readdir(path.join(COPIA, album)))
  .filter((n) => n.endsWith('.jpg'))
  .map((n) => n.replace('.jpg', ''))
  .sort()
const cap = capitoli.find((c) => c.slug === album)
const colore = await coloreCopertina(cap?.copertina ?? '')
dati.album = {
  ...cap,
  colore,
  tinta: tintaDaColore(colore),
  testoCompleto: [
    'Esibizioni di pole dance all’aperto, su una pedana rotonda montata in un campo da basket.',
    'Luce di fine giornata, biciclette e panche sullo sfondo, un quarto d’ora di foto.',
  ],
  img: await riduci(cap?.copertina ?? '', 1800),
  foto: await Promise.all(
    nomi.map(async (n) => ({ grande: await riduci(n, 1600), mini: await riduci(n, 400) })),
  ),
  successivo: {
    titolo: 'Boxe',
    ...(await (async () => {
      const c = await coloreCopertina('boxe-01')
      return { tinta: tintaDaColore(c) }
    })()),
  },
}
await fs.writeFile(path.join(QUI, 'dati.js'), `window.DATI = ${JSON.stringify(dati, null, 2)}\n`)

const NM = path.join(QUI, '..', 'node_modules', '@fontsource-variable')
await fs.copyFile(
  path.join(NM, 'archivo', 'files', 'archivo-latin-wdth-normal.woff2'),
  path.join(FONT, 'archivo.woff2'),
)
for (const f of await fs.readdir(path.join(NM, 'literata', 'files'))) {
  if (/literata-latin-(opsz|wght)-normal\.woff2$/.test(f))
    await fs.copyFile(path.join(NM, 'literata', 'files', f), path.join(FONT, 'literata.woff2'))
}
for (const c of dati.capitoli)
  console.log(
    c.slug.padEnd(22),
    c.colore,
    '→',
    c.tinta.fondo,
    'contrasto',
    c.tinta.contrastoTesto.toFixed(1),
    'chiaro',
    c.tinta.chiaro,
    'sec',
    c.tinta.secondario,
  )
console.log('album', dati.album.tinta, 'successivo', dati.album.successivo.tinta.fondo)
