import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const mappa = new URL('sitemap-index.xml', site).href
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /contatti/invia/\n\nSitemap: ${mappa}\n`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  )
}
