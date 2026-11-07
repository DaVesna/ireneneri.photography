// Comportamento delle strisce di foto: pulsanti avanti/indietro, frecce da tastiera, contatore.
// Lo scorrimento con il dito o il trackpad è quello nativo del browser (scroll-snap).

const ridotto = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function avvia(box: HTMLElement) {
  const fila = box.querySelector<HTMLElement>('.striscia')
  if (!fila || fila.dataset.pronta) return
  fila.dataset.pronta = '1'
  const voci = () => [...fila.children] as HTMLElement[]
  const comandi = box.querySelector<HTMLElement>('.comandi')
  const [prec, succ] = [...(comandi?.querySelectorAll<HTMLButtonElement>('[data-dir]') ?? [])]
  const contatore = box.querySelector<HTMLElement>('.contatore')
  const pad = () => parseFloat(getComputedStyle(fila).scrollPaddingLeft) || 0

  // Con JavaScript attivo i pulsanti servono (senza, si scorre con il dito o la barra).
  if (comandi) comandi.hidden = false

  const indiceCorrente = () => {
    const x = fila.scrollLeft + pad()
    const i = voci().findIndex((v) => v.offsetLeft + v.offsetWidth / 2 > x)
    return Math.max(0, i)
  }
  const vaiA = (i: number) => {
    const v = voci()[Math.max(0, Math.min(voci().length - 1, i))]
    if (v) fila.scrollTo({ left: v.offsetLeft - pad(), behavior: ridotto() ? 'auto' : 'smooth' })
  }
  const passo = (dir: number) => {
    const x = fila.scrollLeft
    const lista = voci()
    const bersaglio =
      dir > 0
        ? lista.find((v) => v.offsetLeft - pad() > x + 4)
        : lista.findLast((v) => v.offsetLeft - pad() < x - 4)
    if (bersaglio)
      fila.scrollTo({ left: bersaglio.offsetLeft - pad(), behavior: ridotto() ? 'auto' : 'smooth' })
  }
  const aggiorna = () => {
    const max = fila.scrollWidth - fila.clientWidth - 2
    if (prec) prec.disabled = fila.scrollLeft <= 2
    if (succ) succ.disabled = fila.scrollLeft >= max
    if (contatore) contatore.textContent = `${indiceCorrente() + 1} / ${voci().length}`
  }

  prec?.addEventListener('click', () => passo(-1))
  succ?.addEventListener('click', () => passo(1))
  fila.addEventListener('scroll', aggiorna, { passive: true })
  fila.addEventListener('keydown', (e) => {
    if (e.target !== fila) return
    if (e.key === 'ArrowRight') (e.preventDefault(), passo(1))
    else if (e.key === 'ArrowLeft') (e.preventDefault(), passo(-1))
    else if (e.key === 'Home') (e.preventDefault(), vaiA(0))
    else if (e.key === 'End') (e.preventDefault(), vaiA(voci().length - 1))
  })
  // Il visore chiede di allineare la striscia alla foto che si stava guardando.
  box.addEventListener('vai-a', (e) => vaiA((e as CustomEvent<number>).detail))
  // Prima misura al fotogramma successivo: niente reflow forzato durante il caricamento.
  requestAnimationFrame(() => new ResizeObserver(aggiorna).observe(fila))
}

export function avviaStrisce() {
  document.querySelectorAll<HTMLElement>('[data-striscia]').forEach(avvia)
}
