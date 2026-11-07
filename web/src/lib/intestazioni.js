// Header di sicurezza del sito. Unica fonte: li usa il middleware per le risposte del server,
// e un test verifica che public/_headers (pagine statiche) contenga esattamente gli stessi.

const TURNSTILE = 'https://challenges.cloudflare.com'

/** Content-Security-Policy stretta: script solo propri e di Turnstile, immagini solo dal sito e da Sanity. */
export const CSP = [
  "default-src 'self'",
  `script-src 'self' ${TURNSTILE}`,
  "style-src 'self'",
  "style-src-elem 'self'",
  // Solo attributi style (variabili CSS di tinta, proporzioni, punto focale, LQIP), mai <style> o fogli esterni.
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' https://cdn.sanity.io data:",
  "font-src 'self'",
  `connect-src 'self' ${TURNSTILE}`,
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
