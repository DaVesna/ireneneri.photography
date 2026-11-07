// Lettura del piano album (scripts/dati/album.json) e ordine delle foto.
import fs from 'node:fs/promises'
import path from 'node:path'
import exifr from 'exifr'
import { RADICE_REPO, ORIGINALI, LAVORO } from './percorsi.mjs'
import { isFileDiSistema } from './file.mjs'

/**
 * @typedef {{ slug: string, titolo: string, cartella: string, ordine: number }} Categoria
 * @typedef {{
 *   slug: string, titolo: string, categoria: string, cartella: string,
 *   copertina?: string, luogo?: string, testo?: string[], alt?: string
 * }} Album
 * @typedef {{ categorie: Categoria[], album: Album[], benvenuto?: string[], inEvidenza?: string[] }} Piano
 */

export const FILE_PIANO = path.join(RADICE_REPO, 'scripts', 'dati', 'album.json')

/** @returns {Promise<Piano>} */
export async function leggiPiano() {
  return JSON.parse(await fs.readFile(FILE_PIANO, 'utf8'))
}

/** Cartella dell'album nella copia di lavoro. @param {string} slug */
export function cartellaLavoro(slug) {
  return path.join(LAVORO, 'album', slug)
}

/** @param {Date} d */
function isoLocale(d) {
  const p = (/** @type {number} */ n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

/**
 * Foto di un album nella cartella originale, in ordine cronologico di scatto
 * (a parità di ora, per nome del file). Legge soltanto.
 * @param {Album} album
 * @returns {Promise<{ originale: string, nome: string, scatto: string | null }[]>}
 */
export async function fotoOrdinate(album) {
  const dir = path.join(ORIGINALI, ...album.cartella.split('/'))
  const nomi = (await fs.readdir(dir, { withFileTypes: true }))
    .filter((e) => e.isFile() && !isFileDiSistema(e.name) && /\.jpe?g$/i.test(e.name))
    .map((e) => e.name)
  const foto = []
  for (const nome of nomi) {
    const originale = path.join(dir, nome)
    /** @type {string | null} */
    let scatto = null
    try {
      const exif = await exifr.parse(originale, { pick: ['DateTimeOriginal', 'CreateDate'] })
      const d = exif?.DateTimeOriginal ?? exif?.CreateDate
      if (d instanceof Date) scatto = isoLocale(d)
    } catch {
      // nessun EXIF: la foto va in coda, ordinata per nome
    }
    foto.push({ originale, nome, scatto })
  }
  foto.sort(
    (a, b) =>
      (a.scatto ?? '9999').localeCompare(b.scatto ?? '9999') || a.nome.localeCompare(b.nome, 'it'),
  )
  return foto
}

/** Nome normalizzato nella copia: <slug>-<nn>.jpg @param {string} slug @param {number} i */
export function nomeNormalizzato(slug, i) {
  return `${slug}-${String(i + 1).padStart(2, '0')}.jpg`
}
