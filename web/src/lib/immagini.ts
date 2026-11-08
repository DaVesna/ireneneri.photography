// URL delle immagini dalla CDN di Sanity, sempre trasformati (larghezza, formato, qualità).
// Il sito non usa mai l'URL del file caricato e non serve mai più di 2560 px sul lato lungo.
import { createImageUrlBuilder } from '@sanity/image-url'
import { DATASET, PROJECT_ID, type Immagine } from './sanity.ts'
import { velaturaDaColore } from './tinta.js'

const builder = createImageUrlBuilder({ projectId: PROJECT_ID, dataset: DATASET })

export const LATO_MAX = 2560
const LARGHEZZE = [320, 480, 640, 800, 1024, 1280, 1600, 2000, 2560]
/** Scala ridotta per gallerie e mosaico: meno varianti, HTML più leggero. */
export const LARGHEZZE_RIDOTTE = [480, 800, 1200, 1600, 2000] as const

/** Forma compatta per il visore: URL senza larghezza + larghezze disponibili. */
export function compatta(img: Immagine) {
  const s = sorgente(img)
  const base = builder.image(img).auto('format').quality(78).fit('max').url()
  const larghezze = s.srcset.split(', ').map((v) => Number(v.split(' ')[1]?.replace('w', '')))
  return { u: base, l: larghezze, w: s.width, h: s.height }
}

export type Sorgente = {
  src: string
  srcset: string
  width: number
  height: number
  lqip?: string | undefined
  fx: string
  fy: string
}

/**
 * Prepara una foto alla sua proporzione naturale (nessun ritaglio).
 * `larghezzaMassima` limita la larghezza più grande offerta nel srcset.
 */
export function sorgente(
  img: Immagine,
  larghezzaMassima = LATO_MAX,
  scala: readonly number[] = LARGHEZZE,
): Sorgente {
  const { larghezza: w, altezza: h } = img.asset
  // Lato lungo mai oltre 2560 px: per una verticale limita la larghezza in proporzione.
  const tettoLato = w >= h ? LATO_MAX : Math.floor((LATO_MAX * w) / h)
  const tetto = Math.min(w, tettoLato, larghezzaMassima)
  const larghezze = [...scala.filter((l) => l < tetto), tetto]
  const url = (l: number) => builder.image(img).width(l).auto('format').quality(78).fit('max').url()
  const media = larghezze[Math.min(larghezze.length - 1, 4)] ?? tetto
  return {
    src: url(media),
    srcset: larghezze.map((l) => `${url(l)} ${l}w`).join(', '),
    width: tetto,
    height: Math.round((tetto * h) / w),
    lqip: img.asset.lqip,
    fx: `${Math.round((img.hotspot?.x ?? 0.5) * 100)}%`,
    fy: `${Math.round((img.hotspot?.y ?? 0.5) * 100)}%`,
  }
}

/** URL di una versione ritagliata sul punto focale (per l'immagine di condivisione). */
export function urlRitaglio(img: Immagine, larghezza: number, altezza: number): string {
  return builder
    .image(img)
    .width(larghezza)
    .height(altezza)
    .fit('crop')
    .auto('format')
    .quality(80)
    .url()
}

export const orizzontale = (img: Immagine) => img.asset.larghezza > img.asset.altezza

/** Colore di partenza della copertina (palette di Sanity): il più saturo disponibile. */
function coloreCopertina(img: Immagine | undefined) {
  const p = img?.asset.palette
  return p?.darkVibrant?.background ?? p?.vibrant?.background ?? p?.dominant?.background
}

/** Variabili CSS della velatura chiara presa dalla copertina (sfondo della pagina album). */
export function stileVelatura(img: Immagine | undefined): string {
  const v = velaturaDaColore(coloreCopertina(img))
  return `--fondo:${v.fondo};--fondo-2:${v.fondo2}`
}

/** Dati per il `<link rel="preload">` della foto principale di una pagina. */
export function precarica(
  img: Immagine | undefined,
  sizes: string,
  scala: readonly number[] = LARGHEZZE,
) {
  if (!img) return undefined
  const s = sorgente(img, LATO_MAX, scala)
  return { src: s.src, srcset: s.srcset, sizes }
}
