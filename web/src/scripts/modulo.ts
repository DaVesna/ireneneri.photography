// Invio del modulo contatti senza ricaricare la pagina. Senza JavaScript il modulo funziona
// lo stesso con l'invio classico.

type Risposta = { ok: boolean; errori?: Record<string, string>; messaggio?: string }
declare global {
  interface Window {
    turnstile?: { reset(el?: Element | string): void }
  }
}

export function avviaModulo() {
  const form = document.querySelector<HTMLFormElement>('[data-modulo]')
  if (!form || form.dataset.pronto) return
  form.dataset.pronto = '1'
  const esito = form.querySelector<HTMLElement>('[data-esito-modulo]')!
  const bottone = form.querySelector<HTMLButtonElement>('button[type="submit"]')!

  const mostraErrori = (errori: Record<string, string> = {}) => {
    form.querySelectorAll<HTMLElement>('.errore').forEach((p) => {
      const campo = p.id.replace(/^err-/, '')
      p.textContent = errori[campo] ?? ''
      const input = form.querySelector<HTMLElement>(`[name="${campo}"]`)
      if (input) {
        if (errori[campo]) input.setAttribute('aria-invalid', 'true')
        else input.removeAttribute('aria-invalid')
      }
    })
    const primo = Object.keys(errori)[0]
    if (primo) form.querySelector<HTMLElement>(`[name="${primo}"]`)?.focus()
  }

  // Controlli immediati sui campi obbligatori, prima di chiamare il server.
  const controllaLocale = () => {
    const e: Record<string, string> = {}
    const v = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? ''
    if (!v('nome')) e.nome = 'Scrivi il tuo nome.'
    if (!v('email')) e.email = 'Scrivi il tuo indirizzo email, per ricevere la risposta.'
    else if (!/^\S+@\S+\.\S{2,}$/.test(v('email')))
      e.email = 'Controlla l’indirizzo email: sembra incompleto.'
    if (!v('tipo')) e.tipo = 'Scegli il tipo di richiesta.'
    if (!v('messaggio')) e.messaggio = 'Scrivi il messaggio.'
    if (!(form.elements.namedItem('consenso') as HTMLInputElement | null)?.checked)
      e.consenso = 'Per inviare il messaggio serve il consenso al trattamento dei dati.'
    return e
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault()
    const locali = controllaLocale()
    if (Object.keys(locali).length) {
      esito.textContent = 'Controlla i campi segnati qui sotto.'
      mostraErrori(locali)
      return
    }
    bottone.disabled = true
    esito.textContent = 'Invio in corso…'
    try {
      const r = await fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>),
        headers: { Accept: 'application/json' },
      })
      const dati = (await r.json().catch(() => ({ ok: false }))) as Risposta
      if (dati.ok) {
        const grazie = document.createElement('div')
        grazie.className = 'grazie'
        grazie.setAttribute('role', 'status')
        grazie.tabIndex = -1
        grazie.innerHTML =
          '<p class="voce">Grazie, il messaggio è arrivato.</p><p>Ti risponderò all’indirizzo email che hai indicato.</p>'
        form.replaceWith(grazie)
        grazie.focus()
        return
      }
      mostraErrori(dati.errori)
      esito.textContent =
        dati.messaggio ||
        (dati.errori && Object.keys(dati.errori).length
          ? 'Controlla i campi segnati qui sotto.'
          : 'Non è stato possibile inviare il messaggio. Riprova tra qualche minuto.')
    } catch {
      esito.textContent =
        'Connessione assente o lenta: il messaggio non è partito. Riprova tra poco.'
    } finally {
      bottone.disabled = false
      window.turnstile?.reset(form.querySelector('.cf-turnstile') ?? undefined)
    }
  })
}
