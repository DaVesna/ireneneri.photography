// Chiave pubblica (site key) di Cloudflare Turnstile. Non è un segreto: compare nella pagina.
// In locale si usa la chiave di prova ufficiale, che supera sempre la verifica.
// Al deploy: variabile PUBLIC_TURNSTILE_SITE_KEY con la chiave vera (vedi docs/deploy.md).
export const CHIAVE_SITO_TURNSTILE: string =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

/** Segreto di prova ufficiale che supera sempre la verifica (solo sviluppo e test). */
export const SEGRETO_PROVA_OK = '1x0000000000000000000000000000000AA'
/** Segreto di prova ufficiale che fallisce sempre (per i test). */
export const SEGRETO_PROVA_KO = '2x0000000000000000000000000000000AA'
