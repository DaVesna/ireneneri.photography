// Filtro dell'elenco album per categoria e anno, con lo stato nell'URL (?categoria=sport&anno=2026).
// Senza JavaScript i filtri restano nascosti e si vedono tutti gli album.

const PER_PAGINA = 12

export function avviaFiltro() {
  const form = document.querySelector<HTMLFormElement>('[data-filtri]')
  const voci = [...document.querySelectorAll<HTMLLIElement>('.mosaico li[data-anno]')]
  const vuoto = document.querySelector<HTMLElement>('[data-vuoto]')
  const altri = document.querySelector<HTMLButtonElement>('[data-altri]')
  const esito = document.querySelector<HTMLElement>('[data-esito]')
  let limite = PER_PAGINA

  const leggi = () => {
    const p = new URLSearchParams(location.search)
    return { categoria: p.get('categoria') ?? '', anno: p.get('anno') ?? '' }
  }

  const applica = (annuncia = false) => {
    const { categoria, anno } = leggi()
    if (form) {
      for (const [nome, valore] of [
        ['categoria', categoria],
        ['anno', anno],
      ] as const) {
        const scelta =
          form.querySelector<HTMLInputElement>(
            `input[name="${nome}"][value="${CSS.escape(valore)}"]`,
          ) ?? form.querySelector<HTMLInputElement>(`input[name="${nome}"][value=""]`)
        if (scelta) scelta.checked = true
      }
    }
    const visibili = voci.filter(
      (v) =>
        (!categoria || v.dataset.categoria === categoria) && (!anno || v.dataset.anno === anno),
    )
    voci.forEach((v) => (v.hidden = true))
    visibili.slice(0, limite).forEach((v) => (v.hidden = false))
    if (vuoto) vuoto.hidden = visibili.length > 0
    if (altri) altri.hidden = visibili.length <= limite
    if (esito && annuncia) {
      esito.textContent =
        visibili.length === 1 ? '1 album' : visibili.length ? `${visibili.length} album` : ''
    }
  }

  const scrivi = (categoria: string, anno: string) => {
    const p = new URLSearchParams()
    if (categoria) p.set('categoria', categoria)
    if (anno) p.set('anno', anno)
    const q = p.toString()
    history.replaceState(null, '', q ? `?${q}` : location.pathname)
    limite = PER_PAGINA
    applica(true)
  }

  if (form) {
    form.hidden = false
    form.addEventListener('change', () => {
      const d = new FormData(form)
      scrivi(String(d.get('categoria') ?? ''), String(d.get('anno') ?? ''))
    })
    form.addEventListener('submit', (e) => e.preventDefault())
  }
  document.querySelector('[data-azzera]')?.addEventListener('click', () => scrivi('', ''))
  altri?.addEventListener('click', () => {
    limite += PER_PAGINA
    applica()
  })
  applica()
}
