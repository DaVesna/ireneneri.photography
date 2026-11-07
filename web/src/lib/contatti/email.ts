// Invio dell'email dietro un'interfaccia unica.
// In locale: invio finto che scrive il messaggio nel log. Il servizio reale (da scegliere al deploy)
// si aggiunge come nuova implementazione di `InvioEmail`, senza toccare il resto.
import { neutralizza, nomePerOggetto, type Campi } from './validazione.ts'

export type MessaggioEmail = {
  a: string
  da: string
  rispondiA: string
  oggetto: string
  testo: string
}

export interface InvioEmail {
  invia(m: MessaggioEmail): Promise<void>
}

/** Invio finto: scrive il messaggio nel log del server. */
export const invioLog = (registra: (s: string) => void = console.log): InvioEmail => ({
  async invia(m) {
    registra(
      [
        '--- email (invio finto, solo log) ---',
        `A: ${m.a}`,
        `Da: ${m.da}`,
        `Rispondi a: ${m.rispondiA}`,
        `Oggetto: ${m.oggetto}`,
        '',
        m.testo,
        '--- fine ---',
      ].join('\n'),
    )
  },
})

/**
 * Compone l'email. Solo il Reply-To contiene un dato dell'utente, ed è un indirizzo già validato.
 * L'oggetto è fisso con il nome ripulito; il corpo ha ogni carattere speciale neutralizzato.
 */
export function componiEmail(
  campi: Campi,
  tipoLeggibile: string,
  a: string,
  da: string,
): MessaggioEmail {
  return {
    a,
    da,
    rispondiA: campi.email,
    oggetto: `Messaggio dal sito da ${nomePerOggetto(campi.nome)}`,
    testo: [
      `Nome: ${neutralizza(campi.nome)}`,
      `Email: ${neutralizza(campi.email)}`,
      `Tipo di richiesta: ${neutralizza(tipoLeggibile)}`,
      '',
      neutralizza(campi.messaggio),
      '',
      '— Inviato dal modulo contatti del sito. Rispondi a questa email per scrivere alla persona.',
    ].join('\n'),
  }
}
