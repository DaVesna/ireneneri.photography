// Gestione di un invio del modulo contatti. Funzione pura: riceve la richiesta e le dipendenze
// (verifica Turnstile, limite, invio email), così i test la provano senza rete né Cloudflare.
import { valida, trappolaScattata, type Campi, type Errori } from './validazione.ts'
import { componiEmail, type InvioEmail } from './email.ts'
import type { Verificatore } from './turnstile.ts'
import type { Limitatore } from './limite.ts'

export const DIMENSIONE_MASSIMA = 20_000 // byte

export type Dipendenze = {
  verifica: Verificatore
  limite: Limitatore
  email: InvioEmail
  destinatario: string
  mittente: string
  /** slug → titolo delle categorie ammesse come tipo di richiesta ("altro" è sempre ammesso). */
  tipi: Record<string, string>
  registra?: (s: string) => void
}

export type Esito =
  | { stato: 'inviato'; http: 200 }
  | { stato: 'campi'; http: 422; errori: Errori; valori: Partial<Campi> }
  | { stato: 'verifica'; http: 400; errori: Errori; valori: Partial<Campi> }
  | { stato: 'respinto'; http: 400 | 405 | 413 | 415; messaggio: string }
  | { stato: 'troppi'; http: 429; messaggio: string }
  | { stato: 'errore'; http: 500; messaggio: string; valori: Partial<Campi> }

// Messaggi generici: non dicono a un eventuale attaccante quale controllo è scattato.
const GENERICO = 'Non è stato possibile inviare il messaggio. Riprova tra qualche minuto.'

export async function gestisciInvio(richiesta: Request, d: Dipendenze): Promise<Esito> {
  const log = d.registra ?? (() => {})
  if (richiesta.method !== 'POST') return { stato: 'respinto', http: 405, messaggio: GENERICO }

  const tipo = richiesta.headers.get('content-type') ?? ''
  if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)/i.test(tipo))
    return { stato: 'respinto', http: 415, messaggio: GENERICO }
  const lunghezza = Number(richiesta.headers.get('content-length') ?? '0')
  if (lunghezza > DIMENSIONE_MASSIMA) return { stato: 'respinto', http: 413, messaggio: GENERICO }

  const ip =
    richiesta.headers.get('cf-connecting-ip') ??
    richiesta.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    null

  if (!(await d.limite(`contatti:${ip ?? 'sconosciuto'}`))) {
    log('contatti: troppi invii dallo stesso indirizzo')
    return {
      stato: 'troppi',
      http: 429,
      messaggio: 'Hai inviato diversi messaggi in poco tempo. Riprova tra qualche minuto.',
    }
  }

  let dati: FormData
  try {
    const corpo = await richiesta.text()
    if (corpo.length > DIMENSIONE_MASSIMA)
      return { stato: 'respinto', http: 413, messaggio: GENERICO }
    dati = await new Request('http://x', {
      method: 'POST',
      headers: { 'content-type': tipo },
      body: corpo,
    }).formData()
  } catch {
    return { stato: 'respinto', http: 400, messaggio: GENERICO }
  }

  if (trappolaScattata(dati)) {
    log('contatti: campo trappola compilato, invio scartato')
    return { stato: 'respinto', http: 400, messaggio: GENERICO }
  }

  const tipiAmmessi = [...Object.keys(d.tipi), 'altro']
  const { ok, campi, errori } = valida(dati, tipiAmmessi)
  const valori: Partial<Campi> = { ...campi }
  if (!ok) return { stato: 'campi', http: 422, errori, valori }

  const token = String(dati.get('cf-turnstile-response') ?? '')
  if (!(await d.verifica(token, ip))) {
    log('contatti: verifica anti-spam non superata')
    return {
      stato: 'verifica',
      http: 400,
      errori: {
        verifica:
          'La verifica anti-spam non è riuscita. Riprova; se il problema resta, scrivi all’indirizzo email indicato.',
      },
      valori,
    }
  }

  try {
    const leggibile = d.tipi[campi.tipo] ?? 'Altro'
    await d.email.invia(componiEmail(campi, leggibile, d.destinatario, d.mittente))
    return { stato: 'inviato', http: 200 }
  } catch (e) {
    log(`contatti: invio email non riuscito (${e instanceof Error ? e.name : 'errore'})`)
    return { stato: 'errore', http: 500, messaggio: GENERICO, valori }
  }
}
