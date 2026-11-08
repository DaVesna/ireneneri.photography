// Header di sicurezza del sito. Unica fonte: li usa il middleware per le risposte del server,
// e un test verifica che public/_headers (pagine statiche) contenga esattamente gli stessi.

const TURNSTILE = 'https://challenges.cloudflare.com'
// Cloudflare Web Analytics (statistiche senza cookie): script e invio dei dati.
const STATISTICHE_SCRIPT = 'https://static.cloudflareinsights.com/beacon.min.js'
const STATISTICHE_INVIO = 'https://cloudflareinsights.com'

/**
 * Content-Security-Policy stretta: script solo propri, di Turnstile e lo script delle statistiche
 * Cloudflare (solo quel file); immagini solo dal sito e da Sanity.
 */
export const CSP = [
  "default-src 'self'",
  `script-src 'self' ${TURNSTILE} ${STATISTICHE_SCRIPT}`,
  "style-src 'self'",
  "style-src-elem 'self'",
  // Solo attributi style (variabili CSS di tinta, proporzioni, punto focale, LQIP), mai <style> o fogli esterni.
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' https://cdn.sanity.io data:",
  "font-src 'self'",
  `connect-src 'self' ${TURNSTILE} ${STATISTICHE_INVIO}`,
  `frame-src ${TURNSTILE}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ')

/** @type {Record<string, string>} */
export const INTESTAZIONI = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}
