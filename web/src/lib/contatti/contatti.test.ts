// Test del modulo contatti:  npm test -w web   (Node ≥ 23 esegue TypeScript direttamente)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gestisciInvio, type Dipendenze } from './gestore.ts'
import { limitatoreInMemoria } from './limite.ts'
import { neutralizza, nomePerOggetto } from './validazione.ts'
import { creaVerificatoreTurnstile } from './turnstile.ts'
import type { MessaggioEmail } from './email.ts'

const TIPI = { sport: 'Sport', eventi: 'Eventi' }

function dipendenze(opz: Partial<Dipendenze> = {}) {
  const inviate: MessaggioEmail[] = []
  const d: Dipendenze = {
    verifica: async () => true,
    limite: limitatoreInMemoria(5, 60_000),
    email: { invia: async (m) => void inviate.push(m) },
    destinatario: 'irene@example.invalid',
    mittente: 'sito@example.invalid',
    tipi: TIPI,
    ...opz,
  }
  return { d, inviate }
}

const VALIDI = {
  nome: 'Marta Rossi',
  email: 'marta@example.com',
  tipo: 'sport',
  messaggio: 'Vorrei un servizio per la gara di sabato prossimo.',
  consenso: 'si',
  'cf-turnstile-response': 'token-di-prova',
}

function richiesta(
  campi: Record<string, string>,
  opz: { ip?: string; metodo?: string; tipo?: string } = {},
) {
  const corpo = new URLSearchParams(campi).toString()
  return new Request('http://localhost/contatti/invia/', {
    method: opz.metodo ?? 'POST',
    headers: {
      'content-type': opz.tipo ?? 'application/x-www-form-urlencoded',
      'cf-connecting-ip': opz.ip ?? '203.0.113.7',
    },
    body: (opz.metodo ?? 'POST') === 'POST' ? corpo : null,
  })
}

test('un invio valido arriva al servizio email (nel log in locale)', async () => {
  const { d, inviate } = dipendenze()
  const esito = await gestisciInvio(richiesta(VALIDI), d)
  assert.equal(esito.stato, 'inviato')
  assert.equal(inviate.length, 1)
  const m = inviate[0]!
  assert.equal(m.a, 'irene@example.invalid')
  assert.equal(m.rispondiA, 'marta@example.com')
  assert.equal(m.oggetto, 'Messaggio dal sito da Marta Rossi')
  assert.match(m.testo, /Tipo di richiesta: Sport/)
})

test('campi mancanti o non validi: errori accanto ai campi, nessun invio', async () => {
  const { d, inviate } = dipendenze()
  const esito = await gestisciInvio(
    richiesta({
      nome: '',
      email: 'non-una-email',
      tipo: 'inventato',
      messaggio: 'corto',
      'cf-turnstile-response': 'x',
    }),
    d,
  )
  assert.equal(esito.stato, 'campi')
  assert.equal(esito.http, 422)
  if (esito.stato !== 'campi') return
  assert.deepEqual(Object.keys(esito.errori).sort(), [
    'consenso',
    'email',
    'messaggio',
    'nome',
    'tipo',
  ])
  assert.equal(inviate.length, 0)
})

test('limiti di lunghezza', async () => {
  const { d } = dipendenze()
  const esito = await gestisciInvio(
    richiesta({ ...VALIDI, nome: 'a'.repeat(81), messaggio: 'b'.repeat(4001) }),
    d,
  )
  assert.equal(esito.stato, 'campi')
  if (esito.stato === 'campi') {
    assert.ok(esito.errori.nome)
    assert.ok(esito.errori.messaggio)
  }
})

test('tentativo di iniettare intestazioni email tramite nome o email: respinto', async () => {
  const { d, inviate } = dipendenze()
  const e1 = await gestisciInvio(
    richiesta({ ...VALIDI, nome: 'Marta\r\nBcc: tutti@example.com' }),
    d,
  )
  const e2 = await gestisciInvio(
    richiesta({ ...VALIDI, email: 'marta@example.com\nBcc: x@example.com' }),
    d,
  )
  assert.equal(e1.stato, 'campi')
  assert.equal(e2.stato, 'campi')
  assert.equal(inviate.length, 0)
})

test('campo trappola compilato (bot): respinto senza invio', async () => {
  const { d, inviate } = dipendenze()
  const esito = await gestisciInvio(richiesta({ ...VALIDI, sito: 'https://spam.example' }), d)
  assert.equal(esito.stato, 'respinto')
  assert.equal(esito.http, 400)
  assert.equal(inviate.length, 0)
})

test('verifica Turnstile fallita: respinto senza invio', async () => {
  const { d, inviate } = dipendenze({ verifica: async () => false })
  const esito = await gestisciInvio(richiesta(VALIDI), d)
  assert.equal(esito.stato, 'verifica')
  assert.equal(esito.http, 400)
  assert.equal(inviate.length, 0)
})

test('raffica di invii dallo stesso indirizzo: dal sesto in poi 429', async () => {
  const { d, inviate } = dipendenze()
  const stati = []
  for (let i = 0; i < 8; i++)
    stati.push((await gestisciInvio(richiesta(VALIDI, { ip: '198.51.100.9' }), d)).http)
  assert.deepEqual(stati, [200, 200, 200, 200, 200, 429, 429, 429])
  assert.equal(inviate.length, 5)
  // Un altro indirizzo non è bloccato.
  assert.equal((await gestisciInvio(richiesta(VALIDI, { ip: '198.51.100.10' }), d)).http, 200)
})

test('metodo, tipo di contenuto e dimensione sbagliati: respinti con messaggio generico', async () => {
  const { d } = dipendenze()
  assert.equal((await gestisciInvio(richiesta(VALIDI, { metodo: 'GET' }), d)).http, 405)
  assert.equal((await gestisciInvio(richiesta(VALIDI, { tipo: 'application/json' }), d)).http, 415)
  const grande = await gestisciInvio(richiesta({ ...VALIDI, messaggio: 'x'.repeat(25_000) }), d)
  assert.equal(grande.http, 413)
  if (grande.stato === 'respinto') assert.doesNotMatch(grande.messaggio, /dimension|byte|413/i)
})

test('il contenuto dell’email ha i caratteri speciali neutralizzati', async () => {
  const { d, inviate } = dipendenze()
  await gestisciInvio(
    richiesta({ ...VALIDI, messaggio: 'Ciao <script>alert("x")</script> & grazie‮' }),
    d,
  )
  const testo = inviate[0]!.testo
  assert.doesNotMatch(testo, /<script>/)
  assert.match(testo, /&#60;script&#62;/)
  assert.doesNotMatch(testo, /‮/)
  assert.equal(neutralizza('a\u0000b'), 'ab')
})

test('oggetto: solo il nome ripulito, su una riga', () => {
  assert.equal(nomePerOggetto('Anna <b>\tBianchi</b>'), 'Anna bBianchib')
  assert.equal(nomePerOggetto('<<>>'), 'una persona')
})

test('verifica Turnstile lato server: esito del servizio, token vuoto, errore di rete', async () => {
  const finto = (success: boolean) =>
    (async () => new Response(JSON.stringify({ success }))) as unknown as typeof fetch
  assert.equal(await creaVerificatoreTurnstile('segreto', finto(true))('tok', '1.2.3.4'), true)
  assert.equal(await creaVerificatoreTurnstile('segreto', finto(false))('tok', null), false)
  assert.equal(await creaVerificatoreTurnstile('segreto', finto(true))('', null), false)
  const rotto = (async () => {
    throw new Error('rete')
  }) as unknown as typeof fetch
  assert.equal(await creaVerificatoreTurnstile('segreto', rotto)('tok', null), false)
})

test('servizio email in errore: messaggio generico, nessun dettaglio interno', async () => {
  const { d } = dipendenze({
    email: { invia: async () => Promise.reject(new Error('SMTP 550 segreto')) },
  })
  const esito = await gestisciInvio(richiesta(VALIDI), d)
  assert.equal(esito.stato, 'errore')
  if (esito.stato === 'errore') assert.doesNotMatch(esito.messaggio, /SMTP|segreto/)
})
