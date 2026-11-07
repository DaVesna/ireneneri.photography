// Header di sicurezza sulle risposte generate dal server (oggi solo /contatti/invia/).
// Le pagine statiche li ricevono da public/_headers, servito dalla piattaforma.
import { defineMiddleware } from 'astro:middleware'
import { INTESTAZIONI } from './lib/intestazioni.js'

export const onRequest = defineMiddleware(async (contesto, prossimo) => {
  const risposta = await prossimo()
  if (contesto.isPrerendered) return risposta
  for (const [nome, valore] of Object.entries(INTESTAZIONI)) {
    // In sviluppo (http://localhost) niente HSTS né upgrade a https.
    if (import.meta.env.DEV && nome === 'Strict-Transport-Security') continue
    risposta.headers.set(
      nome,
      import.meta.env.DEV && nome === 'Content-Security-Policy'
        ? valore.replace('; upgrade-insecure-requests', '')
        : valore,
    )
  }
  return risposta
})
