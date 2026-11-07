import type { PortableTextBlock } from 'sanity'

/**
 * Dimensioni di un'immagine ricavate dal riferimento all'asset,
 * che Sanity scrive come "image-<id>-<larghezza>x<altezza>-<formato>".
 */
export function dimensioniDaRiferimento(
  ref?: string,
): { larghezza: number; altezza: number } | null {
  const m = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/i)
  if (!m) return null
  return { larghezza: Number(m[1]), altezza: Number(m[2]) }
}

/** Avviso (non blocca il salvataggio) se una foto supera i 4000 px sul lato lungo. */
export function avvisoFotoGrande(value: unknown): true | string {
  const ref = (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref
  const d = dimensioniDaRiferimento(ref)
  if (d && Math.max(d.larghezza, d.altezza) > 4000) {
    return 'Foto molto grande: esportala a 3000 px dal lato lungo prima di caricarla.'
  }
  return true
}

/** Numero di caratteri del testo di un campo a paragrafi (Portable Text). */
export function caratteriTesto(blocchi?: PortableTextBlock[]): number {
  if (!Array.isArray(blocchi)) return 0
  return blocchi.reduce((tot, b) => {
    const figli = (b as { children?: { text?: string }[] }).children ?? []
    return tot + figli.reduce((t, c) => t + (c.text?.length ?? 0), 0)
  }, 0)
}
