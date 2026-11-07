// Lighthouse in modalità mobile (4G simulato) sulle pagine indicate.
//
//   npm run lighthouse                         home e pagina album su http://localhost:4322
//   npm run lighthouse -- http://localhost:4322 /chi-sono/
//
// Usa il Chromium di Playwright, collegato con una porta di debug (evita i problemi di avvio
// di Chrome su Windows). Report HTML in screenshots/lighthouse/ (esclusa da git).
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
import lighthouse from 'lighthouse'

const [base = 'http://localhost:4322', ...percorsi] = process.argv.slice(2)
const pagine = percorsi.length ? percorsi : ['/', '/album/teatro-di-monfalcone/']
const PORTA = 9333
await fs.mkdir('screenshots/lighthouse', { recursive: true })

const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORTA}`] })
const risultati = []
for (const p of pagine) {
  const r = await lighthouse(base + p, {
    port: PORTA,
    output: 'html',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttlingMethod: 'simulate',
  })
  if (!r) continue
  const nome = p.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home'
  await fs.writeFile(`screenshots/lighthouse/${nome}.html`, /** @type {string} */ (r.report))
  const c = r.lhr.categories
  const a = r.lhr.audits
  const punti = Object.fromEntries(
    Object.entries(c).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]),
  )
  risultati.push({
    pagina: p,
    ...punti,
    LCP: a['largest-contentful-paint']?.displayValue,
    CLS: a['cumulative-layout-shift']?.displayValue,
    TBT: a['total-blocking-time']?.displayValue,
  })
  const daMigliorare = Object.entries(a)
    .filter(
      ([, v]) =>
        v.score !== null &&
        v.score < 0.9 &&
        ['binary', 'numeric', 'metricSavings'].includes(v.scoreDisplayMode),
    )
    .map(([k, v]) => `${k}${v.displayValue ? ` (${v.displayValue})` : ''}`)
  if (daMigliorare.length) console.log(`${p} — da migliorare: ${daMigliorare.join(', ')}`)
}
await browser.close()
console.table(risultati)
