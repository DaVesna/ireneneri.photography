// Server statico con compressione gzip, per misurare il build come lo servirà la CDN di Cloudflare
// (`astro preview` non comprime l'HTML e peggiora le misure di Lighthouse). Solo per misure locali:
// non applica gli header di sicurezza e non esegue l'endpoint del modulo contatti.
//
//   npm run build:web
//   npm run anteprima:compressa          serve web/dist/client su http://localhost:4323
//   npm run lighthouse -- http://localhost:4323
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { RADICE_REPO } from './lib/percorsi.mjs'

const radice = path.resolve(process.argv[2] || path.join(RADICE_REPO, 'web', 'dist', 'client'))
const porta = Number(process.argv[3] || 4323)
/** @type {Record<string, string>} */
const TIPI = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

if (!fs.existsSync(radice)) {
  console.error(`Cartella non trovata: ${radice}. Esegui prima "npm run build:web".`)
  process.exit(1)
}

http
  .createServer((richiesta, risposta) => {
    let p = decodeURIComponent(new URL(richiesta.url ?? '/', 'http://x').pathname)
    if (p.endsWith('/')) p += 'index.html'
    let file = path.join(radice, p)
    if (!file.startsWith(radice)) {
      risposta.writeHead(403)
      risposta.end()
      return
    }
    if (!fs.existsSync(file) && fs.existsSync(path.join(file, 'index.html')))
      file = path.join(file, 'index.html')
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      risposta.writeHead(404)
      risposta.end()
      return
    }
    const corpo = fs.readFileSync(file)
    const tipo = TIPI[path.extname(file)] ?? 'application/octet-stream'
    const comprimi =
      /text|javascript|xml|svg/.test(tipo) &&
      /gzip/.test(String(richiesta.headers['accept-encoding'] ?? ''))
    risposta.writeHead(200, {
      'Content-Type': tipo,
      ...(comprimi ? { 'Content-Encoding': 'gzip' } : {}),
      'Cache-Control': p.includes('/_astro/') ? 'public, max-age=31536000, immutable' : 'no-cache',
    })
    risposta.end(comprimi ? zlib.gzipSync(corpo, { level: 9 }) : corpo)
  })
  .listen(porta, () =>
    console.log(`Build servito con gzip su http://localhost:${porta} (Ctrl+C per fermare)`),
  )
