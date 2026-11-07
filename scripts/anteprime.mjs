// Miniature (lato lungo 400 px) e provini a griglia dalla copia di lavoro.
//
//   npm run foto:anteprime
//
// Output in src/photos/anteprime/ (esclusa da git):
//   <slug>/<nome>.jpg          miniature
//   provini/<slug>-1.jpg ...   fogli da 20 foto, con numero e orientamento sotto ogni foto
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { RADICE_REPO } from './lib/percorsi.mjs'
import { leggiPiano, cartellaLavoro } from './lib/piano.mjs'

const USCITA = path.join(RADICE_REPO, 'src', 'photos', 'anteprime')
const LATO = 400
const CELLA = 300
const DIDASCALIA = 28
const COLONNE = 5
const PER_FOGLIO = 20

sharp.cache(false)

/** @param {string} s */
const esc = (s) => s.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`)

const piano = await leggiPiano()
await fs.mkdir(path.join(USCITA, 'provini'), { recursive: true })

for (const album of piano.album) {
  const sorgente = cartellaLavoro(album.slug)
  const dest = path.join(USCITA, album.slug)
  await fs.mkdir(dest, { recursive: true })
  const nomi = (await fs.readdir(sorgente)).filter((n) => n.endsWith('.jpg')).sort()
  /** @type {{ nome: string, file: string, w: number, h: number }[]} */
  const mini = []
  for (const nome of nomi) {
    const file = path.join(dest, nome)
    const info = await sharp(path.join(sorgente, nome))
      .rotate()
      .resize(LATO, LATO, { fit: 'inside' })
      .jpeg({ quality: 78 })
      .toFile(file)
    mini.push({ nome, file, w: info.width, h: info.height })
  }
  for (let f = 0; f * PER_FOGLIO < mini.length; f++) {
    const gruppo = mini.slice(f * PER_FOGLIO, (f + 1) * PER_FOGLIO)
    const righe = Math.ceil(gruppo.length / COLONNE)
    const W = COLONNE * CELLA
    const H = 50 + righe * (CELLA + DIDASCALIA)
    /** @type {import('sharp').OverlayOptions[]} */
    const strati = [
      {
        input: Buffer.from(
          `<svg width="${W}" height="50"><text x="12" y="34" font-family="sans-serif" font-size="24" fill="#eee">${esc(album.titolo)} — foglio ${f + 1}</text></svg>`,
        ),
        left: 0,
        top: 0,
      },
    ]
    for (const [i, m] of gruppo.entries()) {
      const x = (i % COLONNE) * CELLA
      const y = 50 + Math.floor(i / COLONNE) * (CELLA + DIDASCALIA)
      const buf = await sharp(m.file)
        .resize(CELLA - 10, CELLA - 10, { fit: 'inside' })
        .toBuffer()
      const meta = await sharp(buf).metadata()
      strati.push({
        input: buf,
        left: x + Math.round((CELLA - (meta.width ?? 0)) / 2),
        top: y + Math.round((CELLA - (meta.height ?? 0)) / 2),
      })
      const n = Number(m.nome.match(/-(\d+)\.jpg$/)?.[1])
      const orient = m.w > m.h ? 'O' : m.w < m.h ? 'V' : 'Q'
      strati.push({
        input: Buffer.from(
          `<svg width="${CELLA}" height="${DIDASCALIA}"><text x="${CELLA / 2}" y="20" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#ddd">${n} · ${orient}</text></svg>`,
        ),
        left: x,
        top: y + CELLA,
      })
    }
    await sharp({ create: { width: W, height: H, channels: 3, background: '#2a2a2a' } })
      .composite(strati)
      .jpeg({ quality: 80 })
      .toFile(path.join(USCITA, 'provini', `${album.slug}-${f + 1}.jpg`))
  }
  console.log(`${album.slug.padEnd(24)} ${mini.length} miniature`)
}
console.log(`\nAnteprime e provini in ${path.relative(RADICE_REPO, USCITA)}`)
