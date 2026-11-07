// Testi dal CMS: paragrafi, date, segnaposto.
import { toHTML, uriLooksSafe } from '@portabletext/to-html'
import type { PortableTextBlock } from '@portabletext/types'

/** Il valore è un segnaposto "[DA FORNIRE: …]" o è vuoto? */
export const daFornire = (v?: string | null): boolean => !v || /^\s*\[DA FORNIRE/i.test(v)

/** Apostrofi e virgolette tipografici: l'apostrofo dritto fra due lettere diventa ’. */
export const tipografia = (s: string) => s.replace(/(\p{L})'(?=\p{L})/gu, '$1’')

function conTipografia(blocchi: PortableTextBlock[]): PortableTextBlock[] {
  return blocchi.map((b) => {
    const figli = (b as { children?: { text?: string }[] }).children
    if (!Array.isArray(figli)) return b
    return {
      ...b,
      children: figli.map((c) =>
        typeof c.text === 'string' ? { ...c, text: tipografia(c.text) } : c,
      ),
    } as PortableTextBlock
  })
}

/** Portable Text → HTML. Solo paragrafi, grassetto, corsivo e link sicuri (testo sempre neutralizzato). */
export function paragrafi(blocchi?: PortableTextBlock[] | null): string {
  if (!blocchi?.length) return ''
  return toHTML(conTipografia(blocchi), {
    components: {
      marks: {
        link: ({ children, value }) => {
          const href = String((value as { href?: string } | undefined)?.href ?? '')
          if (!uriLooksSafe(href)) return children
          const esterno = /^https?:/i.test(href)
          const attr = href.replace(/[&"<>]/g, (c) => `&#${c.charCodeAt(0)};`)
          return `<a href="${attr}"${esterno ? ' rel="noopener"' : ''}>${children}</a>`
        },
      },
    },
    onMissingComponent: false,
  })
}

/** Testo semplice dei paragrafi (per descrizioni e meta). */
export function testoSemplice(blocchi?: PortableTextBlock[] | null): string {
  return (blocchi ?? [])
    .map((b) =>
      ((b as { children?: { text?: string }[] }).children ?? []).map((c) => c.text ?? '').join(''),
    )
    .join(' ')
    .trim()
}

const formatoData = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "2026-03-22" → "22 marzo 2026" */
export function data(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? '' : formatoData.format(d)
}

export const anno = (iso?: string | null) => (iso ? iso.slice(0, 4) : '')

/** "22 marzo 2026, Monfalcone" (data e luogo in frase, senza separatori grafici). */
export const dataELuogo = (iso?: string | null, luogo?: string | null) =>
  [data(iso), luogo].filter(Boolean).join(', ')

/** "1 foto" / "13 foto" */
export const quanteFoto = (n: number) => `${n} foto`
