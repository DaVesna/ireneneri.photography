// URL delle immagini dalla CDN di Sanity, sempre trasformati (larghezza, formato, qualità).
// Il sito non usa mai l'URL del file caricato e non serve mai più di 2560 px sul lato lungo.
import { createImageUrlBuilder } from '@sanity/image-url'
import { DATASET, PROJECT_ID, type Immagine } from './sanity.ts'
import { tintaDaColore } from './tinta.js'

const builder = createImageUrlBuilder({ projectId: PROJECT_ID, dataset: DATASET })

export const LATO_MAX = 2560
const LARGHEZZE = [320, 480, 640, 800, 1024, 1280, 1600, 2000, 2560]
/** Scala ridotta per le foto delle strisce (altezza fissa): meno varianti, HTML più leggero. */
export const LARGHEZZE_STRISCIA = [480, 800, 1200, 1600, 2000] as const

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

/** Tinta della pagina ricavata dalla palette della copertina. */
export function tintaCopertina(img: Immagine | undefined) {
  const p = img?.asset.palette
  const colore = p?.darkVibrant?.background ?? p?.vibrant?.background ?? p?.dominant?.background
  return tintaDaColore(colore)
}

/** Variabili CSS della tinta, da mettere nello stile di una sezione o del body. */
export function stileTinta(img: Immagine | undefined): string {
  const t = tintaCopertina(img)
  return `--fondo:${t.fondo};--chiaro:${t.chiaro};--secondario:${t.secondario}`
}

/** `sizes` di una foto nella striscia (altezza fissa: larghezza = altezza × proporzione, mai oltre lo schermo). */
export function sizesStriscia(img: Immagine, tipo: 'benvenuto' | 'carosello'): string {
  const altezze =
    tipo === 'carosello'
      ? { mobile: 'min(64vh, 115vw)', desktop: 'min(72vh, 780px)' }
      : { mobile: 'min(58vh, 120vw)', desktop: 'min(64vh, 640px)' }
  const r = img.asset.larghezza / img.asset.altezza
  const rMobile = tipo === 'benvenuto' ? Math.min(r, 0.8) : r
  return `(max-width: 760px) min(calc(${altezze.mobile} * ${rMobile.toFixed(3)}), 92vw), min(calc(${altezze.desktop} * ${r.toFixed(3)}), 92vw)`
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

export const SIZES_COPERTINA_VERTICALE =
  '(max-width: 760px) 92vw, min(calc(min(84vh, 900px) * 0.75), 50vw)'
