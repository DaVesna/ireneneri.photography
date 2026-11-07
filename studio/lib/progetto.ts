// Identificativi del progetto Sanity. Non sono segreti: compaiono comunque in ogni
// richiesta dello Studio e del sito. I token invece stanno solo nel file .env.
export const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || '10o0605j'
export const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'

/** Documenti singoli: uno solo per tipo, con ID fisso, senza "elimina" e "duplica". */
export const SINGOLI = ['home', 'chiSono', 'contatti', 'privacy', 'impostazioni'] as const
export type Singolo = (typeof SINGOLI)[number]
