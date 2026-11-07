// Limite di invii per indirizzo IP.
// In produzione si usa il binding Rate Limiting di Cloudflare (vedi docs/deploy.md), che vale
// per tutte le istanze del Worker. In locale e nei test basta un contatore in memoria.

export type Limitatore = (chiave: string) => Promise<boolean> // true = invio consentito

/** Finestra mobile in memoria: al massimo `massimo` invii ogni `finestraMs` per chiave. */
export function limitatoreInMemoria(
  massimo = 5,
  finestraMs = 10 * 60 * 1000,
  ora = () => Date.now(),
): Limitatore {
  const storico = new Map<string, number[]>()
  return async (chiave) => {
    const t = ora()
    const recenti = (storico.get(chiave) ?? []).filter((x) => t - x < finestraMs)
    if (recenti.length >= massimo) {
      storico.set(chiave, recenti)
      return false
    }
    recenti.push(t)
    storico.set(chiave, recenti)
    // Pulizia occasionale per non far crescere la mappa.
    if (storico.size > 5000)
      for (const [k, v] of storico) if (!v.some((x) => t - x < finestraMs)) storico.delete(k)
    return true
  }
}

/** Binding Rate Limiting di Cloudflare Workers (`ratelimits` in wrangler.jsonc). */
export type BindingLimite = { limit(o: { key: string }): Promise<{ success: boolean }> }

export function limitatoreCloudflare(binding: BindingLimite): Limitatore {
  return async (chiave) => {
    try {
      return (await binding.limit({ key: chiave })).success
    } catch {
      return true // se il servizio non risponde non si blocca chi scrive davvero
    }
  }
}
