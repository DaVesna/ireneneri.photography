import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { INTESTAZIONI, CSP } from './intestazioni.js'

test('public/_headers contiene esattamente gli header di src/lib/intestazioni.js', () => {
  const file = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8')
  const righe = file
    .split('\n')
    .filter((r) => r.startsWith('  '))
    .map((r) => r.trim())
  const attese = Object.entries(INTESTAZIONI).map(([k, v]) => `${k}: ${v}`)
  assert.deepEqual(righe, attese)
})

test('CSP: nessun unsafe-inline per gli script, nessuna origine immagini oltre al sito e a Sanity', () => {
  const script = CSP.split('; ').find((d) => d.startsWith('script-src')) ?? ''
  assert.doesNotMatch(script, /unsafe/)
  assert.equal(
    CSP.split('; ').find((d) => d.startsWith('img-src')),
    "img-src 'self' https://cdn.sanity.io data:",
  )
  assert.match(CSP, /frame-ancestors 'none'/)
})
