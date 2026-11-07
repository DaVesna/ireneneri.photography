// Controlli di qualità sul sito in esecuzione: accessibilità (axe), tastiera, reduced-motion, console.
//
//   npm run qualita                       contro http://localhost:4322 (astro preview)
//   npm run qualita -- http://localhost:4321
//
// Esce con codice 1 se trova errori gravi.
import { chromium } from 'playwright'
import { AxeBuilder } from '@axe-core/playwright'

const BASE = process.argv[2] || 'http://localhost:4322'
const PAGINE = [
  '/',
  '/album/',
  '/album/teatro-di-monfalcone/',
  '/album/piero/',
  '/album/boxe/',
  '/chi-sono/',
  '/contatti/',
  '/privacy/',
  '/pagina-che-non-esiste/',
]
const LARGHEZZE = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]
let problemi = 0
const segnala = (/** @type {string} */ m) => {
  problemi++
  console.log('  ✗ ' + m)
}
const ok = (/** @type {string} */ m) => console.log('  ✓ ' + m)

const browser = await chromium.launch()

// ---------------------------------------------------------------- axe e console
console.log('Accessibilità (axe, WCAG 2.2 A/AA) e console')
for (const vp of LARGHEZZE) {
  const ctx = await browser.newContext({ viewport: vp })
  const page = await ctx.newPage()
  /** @type {string[]} */
  const errori = []
  page.on('console', (m) => {
    if (m.type() === 'error' && !/status of 404/.test(m.text()))
      errori.push(`${page.url()}: ${m.text()}`)
  })
  page.on('pageerror', (e) => errori.push(`${page.url()}: ${e.message}`))
  for (const p of PAGINE) {
    await page.goto(BASE + p, { waitUntil: 'load' })
    await page.waitForTimeout(p.startsWith('/contatti') ? 2500 : 600)
    const r = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .exclude('.cf-turnstile') // widget di terze parti in un iframe
      .analyze()
    const gravi = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    const minori = r.violations.filter((v) => !gravi.includes(v))
    if (gravi.length)
      gravi.forEach((v) =>
        segnala(`${vp.width}px ${p}: ${v.id} (${v.impact}) ×${v.nodes.length} — ${v.help}`),
      )
    else
      ok(
        `${vp.width}px ${p}: 0 errori gravi${minori.length ? `, minori: ${minori.map((v) => v.id).join(', ')}` : ''}`,
      )
  }
  if (errori.length) errori.forEach((e) => segnala(`console: ${e}`))
  else ok(`${vp.width}px: nessun errore in console`)
  await ctx.close()
}

// ---------------------------------------------------------------- tastiera
console.log('\nTastiera')
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE + '/', { waitUntil: 'load' })
  await page.keyboard.press('Tab')
  const primo = await page.evaluate(() => document.activeElement?.textContent?.trim())
  primo === 'Vai al contenuto'
    ? ok('primo Tab: link "Vai al contenuto"')
    : segnala(`primo Tab su "${primo}"`)
  const visibile = await page.evaluate(() => {
    const el = document.activeElement
    if (!el) return false
    const s = getComputedStyle(el)
    return (
      el.getBoundingClientRect().top >= 0 &&
      (s.outlineStyle !== 'none' || s.boxShadow !== 'none' || el.matches('.salta'))
    )
  })
  visibile ? ok('focus visibile') : segnala('focus non visibile')
  // Menu
  /** @type {string[]} */
  const visti = []
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab')
    visti.push((await page.evaluate(() => document.activeElement?.textContent?.trim())) ?? '')
  }
  ;['Irene Neri', 'Album', 'Chi sono', 'Contatti'].every((v) => visti.includes(v))
    ? ok('menu raggiungibile con Tab')
    : segnala(`menu: ${visti.join(' | ')}`)

  // Carosello e visore
  await page.goto(BASE + '/album/piero/', { waitUntil: 'load' })
  await page.focus('.carosello .striscia')
  const x0 = await page.$eval('.carosello .striscia', (e) => e.scrollLeft)
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(700)
  const x1 = await page.$eval('.carosello .striscia', (e) => e.scrollLeft)
  x1 > x0 ? ok('carosello: freccia destra scorre') : segnala('carosello: la freccia non scorre')
  await page.focus('#foto-2')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  const aperto = await page.$eval('dialog.visore', (d) => /** @type {HTMLDialogElement} */ (d).open)
  aperto ? ok('visore: Invio su una foto lo apre') : segnala('visore non si apre con Invio')
  const focusDentro = await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))
  focusDentro ? ok('visore: il focus è dentro il visore') : segnala('visore: focus fuori')
  await page.keyboard.press('ArrowRight')
  const cont = await page.$eval('dialog .contatore', (e) => e.textContent)
  cont === '3 / 23' ? ok('visore: freccia destra → 3 / 23') : segnala(`visore: contatore ${cont}`)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
  const dopo = await page.evaluate(() => ({
    open: document.querySelector('dialog')?.open,
    id: document.activeElement?.id,
  }))
  !dopo.open && dopo.id === 'foto-3'
    ? ok('visore: Esc chiude e il focus torna sulla foto')
    : segnala(`visore dopo Esc: ${JSON.stringify(dopo)}`)

  // Modulo
  await page.goto(BASE + '/contatti/', { waitUntil: 'load' })
  await page.focus('#nome')
  await page.keyboard.type('Prova Tastiera')
  await page.keyboard.press('Tab')
  await page.keyboard.type('tastiera@example.com')
  await page.keyboard.press('Tab')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Tab')
  await page.keyboard.type('Messaggio scritto solo con la tastiera.')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Space')
  const stato = await page.evaluate(() => ({
    tipo: /** @type {HTMLSelectElement} */ (document.querySelector('#tipo')).value,
    consenso: /** @type {HTMLInputElement} */ (document.querySelector('#consenso')).checked,
  }))
  stato.tipo && stato.consenso
    ? ok('modulo: tutti i campi compilabili da tastiera')
    : segnala(`modulo: ${JSON.stringify(stato)}`)
  await page.close()
}

// ---------------------------------------------------------------- reduced motion
console.log('\nprefers-reduced-motion')
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  await page.goto(BASE + '/album/', { waitUntil: 'load' })
  const transizioni = await page.evaluate(
    () =>
      [...document.querySelectorAll('*')].filter((e) => {
        const s = getComputedStyle(e)
        return (
          parseFloat(s.transitionDuration) > 0.01 ||
          (s.animationName !== 'none' && parseFloat(s.animationDuration) > 0.01)
        )
      }).length,
  )
  transizioni === 0
    ? ok('nessuna transizione o animazione attiva')
    : segnala(`${transizioni} elementi con transizioni attive`)
  await page.goto(BASE + '/album/piero/', { waitUntil: 'load' })
  await page.click('.carosello [data-dir="1"]')
  await page.waitForTimeout(60)
  const x = await page.$eval('.carosello .striscia', (e) => e.scrollLeft)
  x > 0
    ? ok('scorrimento del carosello immediato, senza animazione')
    : segnala('scorrimento non immediato')
  await ctx.close()
}

await browser.close()
console.log(problemi ? `\n${problemi} problemi trovati.` : '\nTutti i controlli superati.')
process.exit(problemi ? 1 : 0)
