// Screenshot di pagine a più larghezze, per la verifica visiva.
//
//   node scripts/screenshot.mjs <cartella-uscita> <url> [url...] [--larghezze=390,1440] [--intera]
//
// Salva <cartella>/<nome-pagina>-<larghezza>.png (viewport) e, con --intera, anche la pagina intera.
import path from 'node:path'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const arg = process.argv.slice(2)
const opz = Object.fromEntries(
  arg
    .filter((a) => a.startsWith('--'))
    .map((a) => a.slice(2).split('='))
    .map(([k, v]) => [k, v ?? true]),
)
const [uscita, ...url] = arg.filter((a) => !a.startsWith('--'))
if (!uscita || !url.length) {
  console.error(
    'Uso: node scripts/screenshot.mjs <cartella> <url> [url...] [--larghezze=390,1440] [--intera]',
  )
  process.exit(1)
}
const ALTEZZE = /** @type {Record<string, number>} */ ({
  390: 844,
  768: 1024,
  1440: 900,
  1920: 1080,
})
const larghezze = String(opz.larghezze ?? '390,1440')
  .split(',')
  .map(Number)
await fs.mkdir(uscita, { recursive: true })
const browser = await chromium.launch()
for (const u of url) {
  const uu = new URL(u)
  const percorso = uu.pathname
    .replace(/\.html$/, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
  const nome =
    uu.protocol === 'file:'
      ? path.basename(uu.pathname, '.html')
      : uu.hostname === 'localhost' || uu.hostname === '127.0.0.1'
        ? percorso || 'home'
        : [uu.hostname.replace(/^www\./, '').split('.')[0], percorso].filter(Boolean).join('-')
  for (const w of larghezze) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: ALTEZZE[w] ?? 900 },
      deviceScaleFactor: 1,
      isMobile: w < 768,
      hasTouch: w < 768,
      reducedMotion: opz.movimento ? 'no-preference' : 'reduce',
    })
    const page = await ctx.newPage()
    const errori = /** @type {string[]} */ ([])
    page.on('console', (m) => m.type() === 'error' && errori.push(m.text()))
    page.on('pageerror', (e) => errori.push(e.message))
    try {
      await page.goto(u, { waitUntil: 'networkidle', timeout: 45000 })
    } catch {
      await page.waitForTimeout(3000)
    }
    await page.waitForTimeout(Number(opz.attesa ?? 1500))
    await page.screenshot({ path: path.join(uscita, `${nome}-${w}.png`) })
    if (opz.intera) {
      // Scorre tutta la pagina per far partire il caricamento differito delle immagini.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
          scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 120))
        }
        scrollTo(0, 0)
      })
      await page.waitForLoadState('networkidle').catch(() => {})
      await page.waitForTimeout(500)
    }
    if (opz.intera)
      await page.screenshot({ path: path.join(uscita, `${nome}-${w}-intera.png`), fullPage: true })
    if (errori.length)
      console.log(
        `${nome} @${w}: ${errori.length} errori in console\n  ` + errori.slice(0, 5).join('\n  '),
      )
    await ctx.close()
  }
  console.log(`ok ${u}`)
}
await browser.close()
