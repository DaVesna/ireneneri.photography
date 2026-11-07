// Validazione lato server del modulo contatti. Nessuna dipendenza: si testa con node --test.

export const LIMITI = { nome: 80, email: 120, messaggio: 4000, tipo: 40 } as const
export const MIN_MESSAGGIO = 10

export type Campi = {
  nome: string
  email: string
  tipo: string
  messaggio: string
  consenso: boolean
}
export type Errori = Partial<Record<keyof Campi | 'verifica', string>>

// Email ragionevole: niente spazi né caratteri di controllo, una sola @, dominio con un punto.
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/
// Caratteri di controllo (compresi a capo e tabulazioni): vietati in nome, email e tipo,
// che finiscono nell'oggetto o nell'intestazione Reply-To dell'email.
const CONTROLLO = /[\x00-\x1f\x7f\u2028\u2029]/

const testo = (v: FormDataEntryValue | null | undefined) => (typeof v === 'string' ? v : '')

/**
 * Valida i campi inviati. `tipiAmmessi` sono gli slug delle categorie più "altro".
 * Gli errori sono pensati per comparire accanto al campo, in italiano semplice.
 */
export function valida(
  dati: { get(nome: string): FormDataEntryValue | null },
  tipiAmmessi: readonly string[],
): { ok: boolean; campi: Campi; errori: Errori } {
  const campi: Campi = {
    nome: testo(dati.get('nome')).trim(),
    email: testo(dati.get('email')).trim(),
    tipo: testo(dati.get('tipo')).trim(),
    messaggio: testo(dati.get('messaggio')).replace(/\r\n?/g, '\n').trim(),
    consenso: testo(dati.get('consenso')) === 'si',
  }
  const errori: Errori = {}

  if (!campi.nome) errori.nome = 'Scrivi il tuo nome.'
  else if (campi.nome.length > LIMITI.nome)
    errori.nome = `Il nome può avere al massimo ${LIMITI.nome} caratteri.`
  else if (CONTROLLO.test(campi.nome)) errori.nome = 'Il nome contiene caratteri non ammessi.'

  if (!campi.email) errori.email = 'Scrivi il tuo indirizzo email, per ricevere la risposta.'
  else if (
    campi.email.length > LIMITI.email ||
    CONTROLLO.test(campi.email) ||
    !EMAIL.test(campi.email)
  )
    errori.email = 'Controlla l’indirizzo email: sembra incompleto.'

  if (!campi.tipo) errori.tipo = 'Scegli il tipo di richiesta.'
  else if (campi.tipo.length > LIMITI.tipo || !tipiAmmessi.includes(campi.tipo))
    errori.tipo = 'Scegli una voce dall’elenco.'

  if (!campi.messaggio) errori.messaggio = 'Scrivi il messaggio.'
  else if (campi.messaggio.length < MIN_MESSAGGIO)
    errori.messaggio = 'Il messaggio è troppo corto: aggiungi qualche dettaglio.'
  else if (campi.messaggio.length > LIMITI.messaggio)
    errori.messaggio = `Il messaggio può avere al massimo ${LIMITI.messaggio} caratteri.`

  if (!campi.consenso)
    errori.consenso = 'Per inviare il messaggio serve il consenso al trattamento dei dati.'

  return { ok: Object.keys(errori).length === 0, campi, errori }
}

/** Il campo trappola è stato compilato? (lo fanno i programmi automatici) */
export const trappolaScattata = (dati: { get(nome: string): FormDataEntryValue | null }) =>
  testo(dati.get('sito')).trim() !== ''

/**
 * Neutralizza un testo dell'utente per il corpo dell'email: toglie i caratteri di controllo
 * (tranne l'a capo) e i caratteri invisibili di direzione del testo, ed effettua l'escape HTML,
 * così il contenuto resta testo anche se un client di posta lo interpretasse come HTML.
 */
export function neutralizza(s: string): string {
  return s
    .replace(/[\x00-\x09\x0b-\x1f\x7f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

/** Nome ripulito per l'oggetto dell'email: una riga, solo caratteri sicuri, al massimo 60. */
export function nomePerOggetto(nome: string): string {
  return (
    nome
      .replace(/[^\p{L}\p{M}\p{N} .'’-]/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 60) || 'una persona'
  )
}
