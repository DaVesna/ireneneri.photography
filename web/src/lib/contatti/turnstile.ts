// Verifica lato server del token Turnstile.
const URL_VERIFICA = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export type Verificatore = (token: string, ip: string | null) => Promise<boolean>

export function creaVerificatoreTurnstile(segreto: string, f: typeof fetch = fetch): Verificatore {
  return async (token, ip) => {
    if (!token || token.length > 2048) return false
    const corpo = new FormData()
    corpo.set('secret', segreto)
    corpo.set('response', token)
    if (ip) corpo.set('remoteip', ip)
    try {
      const r = await f(URL_VERIFICA, { method: 'POST', body: corpo })
      if (!r.ok) return false
      const esito = (await r.json()) as { success?: boolean }
      return esito.success === true
    } catch {
      return false
    }
  }
}
