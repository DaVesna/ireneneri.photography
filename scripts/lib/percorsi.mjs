// Percorsi condivisi dagli script delle foto.
// Si possono cambiare con le variabili FOTO_ORIGINALI e FOTO_LAVORO nel file .env.
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const RADICE_REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

/** Cartella delle foto originali: SOLA LETTURA. */
export const ORIGINALI = path.resolve(
  process.env.FOTO_ORIGINALI || path.join(RADICE_REPO, 'src', 'photos', 'original'),
)

/** Cartella di lavoro: qui si può riorganizzare liberamente. */
export const LAVORO = path.resolve(
  process.env.FOTO_LAVORO || path.join(RADICE_REPO, 'src', 'photos', 'backup'),
)

export const DOCS = path.join(RADICE_REPO, 'docs')

/**
 * Blocca qualsiasi scrittura dentro la cartella degli originali.
 * Da chiamare prima di ogni operazione che crea o modifica file.
 * @param {string} destinazione
 */
export function vietaScritturaNegliOriginali(destinazione) {
  const rel = path.relative(ORIGINALI, path.resolve(destinazione))
  if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) {
    throw new Error(`Scrittura vietata nella cartella degli originali: ${destinazione}`)
  }
}
