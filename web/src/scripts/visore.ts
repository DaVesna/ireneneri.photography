// Visore a tutto schermo per le foto di un album.
// Apertura da clic sulla striscia o sulle miniature, link diretto #foto-N, tastiera (frecce,
// Inizio/Fine, Esc), swipe, precaricamento delle foto vicine. Senza JavaScript i link #foto-N
// portano semplicemente alla foto nella striscia.

type Voce = {
  src: string
  srcset: string
  width: number
  height: number
  alt: string
  didascalia?: string
}

export function avviaVisore() {
  const dialogo = document.querySelector<HTMLDialogElement>('dialog.visore')
  const datiEl = document.getElementById('dati-visore')
  if (!dialogo || !datiEl || dialogo.dataset.pronto) return
  dialogo.dataset.pronto = '1'
  const foto: Voce[] = JSON.parse(datiEl.textContent || '[]')
  const n = foto.length
  if (!n) return

  const img = dialogo.querySelector<HTMLImageElement>('img')!
  const didascalia = dialogo.querySelector<HTMLElement>('figcaption')!
  const contatore = dialogo.querySelector<HTMLElement>('.contatore')!
  const striscia = document.querySelector<HTMLElement>('.striscia-box.carosello')
  let corrente = 0
  let ultimoFocus: HTMLElement | null = null
  const precaricate = new Set<number>()

  const precarica = (i: number) => {
    const j = (i + n) % n
    const f = foto[j]
    if (!f || precaricate.has(j)) return
    precaricate.add(j)
    const p = new Image()
    p.sizes = '100vw'
    p.srcset = f.srcset
    p.src = f.src
  }

  const mostra = (i: number) => {
    corrente = (i + n) % n
    const f = foto[corrente]!
    img.removeAttribute('src')
    img.srcset = f.srcset
    img.src = f.src
    img.width = f.width
    img.height = f.height
    img.alt = f.alt
    didascalia.textContent = f.didascalia ?? ''
    didascalia.hidden = !f.didascalia
    contatore.textContent = `${corrente + 1} / ${n}`
    history.replaceState(null, '', `#foto-${corrente + 1}`)
    precarica(corrente + 1)
    precarica(corrente - 1)
  }

  const apri = (i: number) => {
    ultimoFocus = document.activeElement as HTMLElement | null
    mostra(i)
    if (!dialogo.open) dialogo.showModal()
  }

  dialogo.addEventListener('close', () => {
    history.replaceState(null, '', location.pathname + location.search)
    striscia?.dispatchEvent(new CustomEvent('vai-a', { detail: corrente }))
    const voce = document.getElementById(`foto-${corrente + 1}`)
    ;(voce ?? ultimoFocus)?.focus({ preventScroll: true })
  })

  // Clic su una foto della striscia o su una miniatura.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#foto-"]')
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return
    const i = Number(a.getAttribute('href')!.slice(6)) - 1
    if (i >= 0 && i < n) {
      e.preventDefault()
      apri(i)
    }
  })

  dialogo.querySelector('.chiudi')?.addEventListener('click', () => dialogo.close())
  dialogo
    .querySelectorAll<HTMLButtonElement>('[data-v]')
    .forEach((b) => b.addEventListener('click', () => mostra(corrente + Number(b.dataset.v))))
  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') (e.preventDefault(), mostra(corrente + 1))
    else if (e.key === 'ArrowLeft') (e.preventDefault(), mostra(corrente - 1))
    else if (e.key === 'Home') (e.preventDefault(), mostra(0))
    else if (e.key === 'End') (e.preventDefault(), mostra(n - 1))
  })
  // Clic sullo sfondo (fuori dalla foto e dai comandi) chiude.
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo || (e.target as Element).matches('figure')) dialogo.close()
  })

  // Swipe orizzontale.
  let x0: number | null = null
  let y0 = 0
  dialogo.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return
    x0 = e.clientX
    y0 = e.clientY
  })
  dialogo.addEventListener('pointerup', (e) => {
    if (x0 === null) return
    const dx = e.clientX - x0
    const dy = e.clientY - y0
    x0 = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) mostra(corrente + (dx < 0 ? 1 : -1))
  })

  // Link diretto: /album/nome/#foto-12 apre il visore sulla foto 12.
  const daHash = () => {
    const m = location.hash.match(/^#foto-(\d+)$/)
    const i = m ? Number(m[1]) - 1 : -1
    if (i >= 0 && i < n) apri(i)
  }
  daHash()
  window.addEventListener('hashchange', daHash)
}
