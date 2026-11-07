// Funzioni di utilità sui file, condivise dagli script.
import fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'

/** File nascosti di macOS e Windows che non sono foto. @param {string} nome */
export function isFileDiSistema(nome) {
  return (
    nome.startsWith('._') || nome === '.DS_Store' || nome === 'Thumbs.db' || nome === 'desktop.ini'
  )
}

/**
 * Elenca ricorsivamente i file di una cartella, in ordine alfabetico, senza aprirli.
 * @param {string} radice
 * @returns {Promise<{percorso: string, dimensione: number, modificato: number}[]>}
 */
export async function elencaFile(radice) {
  /** @type {{percorso: string, dimensione: number, modificato: number}[]} */
  const out = []
  /** @param {string} dir */
  async function giro(dir) {
    const voci = await fs.readdir(dir, { withFileTypes: true })
    voci.sort((a, b) => a.name.localeCompare(b.name, 'it'))
    for (const e of voci) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) await giro(p)
      else if (e.isFile()) {
        const st = await fs.stat(p)
        out.push({
          percorso: path.relative(radice, p),
          dimensione: st.size,
          modificato: Math.round(st.mtimeMs),
        })
      }
    }
  }
  await giro(radice)
  return out
}

/**
 * Impronta di una cartella: conteggio, dimensioni e date di modifica di ogni file.
 * @param {string} radice
 */
export async function impronta(radice) {
  const file = (await elencaFile(radice)).map((f) => ({
    ...f,
    percorso: f.percorso.split(path.sep).join('/'),
  }))
  return { creata: new Date().toISOString(), radice, conteggio: file.length, file }
}

/** SHA-256 di un file, letto in streaming. @param {string} file */
export function sha256(file) {
  return new Promise((resolve, reject) => {
    const h = createHash('sha256')
    createReadStream(file)
      .on('data', (d) => h.update(d))
      .on('end', () => resolve(h.digest('hex')))
      .on('error', reject)
  })
}

/** @param {number} byte */
export function formattaPeso(byte) {
  if (byte < 1024) return `${byte} B`
  if (byte < 1024 ** 2) return `${(byte / 1024).toFixed(0)} KB`
  if (byte < 1024 ** 3) return `${(byte / 1024 ** 2).toFixed(1)} MB`
  return `${(byte / 1024 ** 3).toFixed(2)} GB`
}
