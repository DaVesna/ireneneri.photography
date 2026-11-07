// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

// Dominio definitivo da confermare al deploy (vedi docs/MANCANTI.md).
const SITO = process.env.SITO_URL || 'https://ireneneri.photography'

export default defineConfig({
  site: SITO,
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  // Pagine pre-renderizzate per default; solo l'invio del modulo contatti gira sul server.
  output: 'static',
  adapter: cloudflare({
    // Le immagini arrivano già trasformate dalla CDN di Sanity: niente servizio immagini di Astro.
    imageService: 'passthrough',
  }),
  integrations: [
    sitemap({
      filter: (pagina) => !/\/contatti\/invia\/?$/.test(pagina),
    }),
  ],
  // Comportamento classico: spazi tra elementi in linea preservati.
  compressHTML: true,
  build: {
    // Fogli di stile sempre come file esterni: niente <style> in linea, CSP più stretta.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Script sempre come file esterni (mai in linea), per la stessa ragione.
      assetsInlineLimit: 0,
    },
  },
})
