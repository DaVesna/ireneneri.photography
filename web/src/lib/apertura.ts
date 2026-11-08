// Diapositive dell'apertura della home a partire dalle foto di benvenuto.
// Su schermi larghi due foto verticali consecutive si affiancano (una verticale da sola a tutto
// schermo perderebbe troppo); su schermi stretti ogni foto è una diapositiva.
import type { Immagine } from './sanity.ts'
import { orizzontale } from './immagini.ts'

export type Diapositiva = Immagine[]

export const MEDIA_LARGO = '(min-width: 761px)'
export const MEDIA_STRETTO = '(max-width: 760px)'

export function diapositiveLarghe(foto: Immagine[]): Diapositiva[] {
  const out: Diapositiva[] = []
  for (let i = 0; i < foto.length; i++) {
    const a = foto[i]!
    const b = foto[i + 1]
    if (!orizzontale(a) && b && !orizzontale(b)) {
      out.push([a, b])
      i++
    } else if (!orizzontale(a)) {
      // Verticale rimasta sola: la si affianca alla prima verticale, invece di tagliarla a metà.
      const compagna = foto.find((f) => f !== a && !orizzontale(f))
      out.push(compagna ? [a, compagna] : [a])
    } else out.push([a])
  }
  return out
}

export const diapositiveStrette = (foto: Immagine[]): Diapositiva[] => foto.map((f) => [f])

/** `sizes` di una foto dentro una diapositiva. */
export const sizesDiapositiva = (d: Diapositiva, largo: boolean) =>
  largo && d.length === 2 ? '(min-width: 761px) 50vw, 100vw' : '100vw'
