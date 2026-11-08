// Tinta di un album ricavata dal colore della copertina.
// Usata dal sito (palette di Sanity) e dal prototipo (colore calcolato con sharp).
//
// Regola: il colore (il più saturo tra quelli della copertina) viene portato in OKLCH,
// la luminosità fissata a 0,25 e la saturazione ridotta al 60% con un massimo di 0,07. Se il testo Gesso non raggiunge 7:1 sul fondo, il fondo si scurisce.

export const GESSO = '#ece8e2'
export const CENERE = '#a8a199'
export const CARBONE = '#1c1a18'

/** @param {string} hex @returns {[number, number, number]} sRGB 0–1 */
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/** @param {[number, number, number]} rgb */
function rgbToHex([r, g, b]) {
  const c = (/** @type {number} */ v) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

/** @param {number} c */
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
/** @param {number} c */
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

/** @param {string} hex @returns {[number, number, number]} [L, C, h] */
export function hexToOklch(hex) {
  const [r0, g0, b0] = hexToRgb(hex)
  const [r, g, b] = [lin(r0), lin(g0), lin(b0)]
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return [L, Math.hypot(a, bb), ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360]
}

/** @param {number} L @param {number} C @param {number} h */
export function oklchToHex(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180)
  const b = C * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  return rgbToHex([gam(r), gam(g), gam(bl)])
}

/** Luminanza relativa WCAG. @param {string} hex */
export function luminanza(hex) {
  const [r0, g0, b0] = hexToRgb(hex)
  const [r, g, b] = [lin(r0), lin(g0), lin(b0)]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Rapporto di contrasto WCAG tra due colori. @param {string} a @param {string} b */
export function contrasto(a, b) {
  const [x, y] = [luminanza(a), luminanza(b)].sort((p, q) => q - p)
  return ((x ?? 0) + 0.05) / ((y ?? 0) + 0.05)
}

/**
 * @param {string | null | undefined} colore  hex del colore della copertina (darkVibrant, vibrant o dominant)
 * @returns {{ fondo: string, chiaro: string, testo: string, secondario: string, contrastoTesto: number }}
 */
export function tintaDaColore(colore) {
  if (!colore) {
    return {
      fondo: CARBONE,
      chiaro: '#cfc8bf',
      testo: GESSO,
      secondario: CENERE,
      contrastoTesto: contrasto(GESSO, CARBONE),
    }
  }
  const [, C, h] = hexToOklch(colore)
  const croma = Math.min(C * 0.6, 0.07)
  let L = 0.25
  let fondo = oklchToHex(L, croma, h)
  while (contrasto(GESSO, fondo) < 7 && L > 0.12) {
    L -= 0.01
    fondo = oklchToHex(L, croma, h)
  }
  const chiaro = oklchToHex(0.82, Math.min(C, 0.07), h)
  // Testo secondario: Cenere se leggibile, altrimenti Gesso un po' attenuato (sempre ≥ 4,5:1).
  const secondario = contrasto(CENERE, fondo) >= 4.5 ? CENERE : '#cdc8c1'
  return { fondo, chiaro, testo: GESSO, secondario, contrastoTesto: contrasto(GESSO, fondo) }
}

/**
 * Velatura chiara per lo sfondo delle pagine album (versione 2 del design): il tono della
 * copertina, appena accennato. Il testo Inchiostro resta sopra 13:1.
 * @param {string | null | undefined} colore
 * @returns {{ fondo: string, fondo2: string }}
 */
export function velaturaDaColore(colore) {
  if (!colore) return { fondo: '#f3f2ee', fondo2: '#e9e7e1' }
  const [, C, h] = hexToOklch(colore)
  const croma = Math.min(C * 0.2, 0.012)
  return { fondo: oklchToHex(0.958, croma, h), fondo2: oklchToHex(0.918, croma * 1.3, h) }
}
