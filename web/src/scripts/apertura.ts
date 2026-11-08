// Apertura della home: dissolvenza tra le diapositive ogni 6 secondi, con pulsante di pausa.
// Le foto successive si caricano poco prima di comparire. Con prefers-reduced-motion niente
// scorrimento automatico: il pulsante fa avanzare a mano.

const INTERVALLO = 6000

function caricaVera(img: HTMLImageElement) {
  if (!img.dataset.srcset) return
  img.srcset = img.dataset.srcset
  img.src = img.dataset.src ?? img.src
  delete img.dataset.srcset
  delete img.dataset.src
}

export function avviaApertura() {
  const box = document.querySelector<HTMLElement>('[data-apertura]')
  if (!box || box.dataset.pronta) return
  box.dataset.pronta = '1'
  const pulsante = box.querySelector<HTMLButtonElement>('[data-pausa]')
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)')
  // Il diaporama visibile dipende dalla larghezza (coppie di verticali solo su schermi larghi).
  const visibile = () =>
    [...box.querySelectorAll<HTMLElement>('[data-diaporama]')].find((d) => d.offsetParent !== null)
  let timer: number | undefined
  let fermo = false

  const avanza = () => {
    const d = visibile()
    if (!d) return
    const diapo = [...d.querySelectorAll<HTMLElement>('.diapo')]
    if (diapo.length < 2) return
    const i = diapo.findIndex((x) => x.classList.contains('attiva'))
    const prossima = diapo[(i + 1) % diapo.length]!
    const dopo = diapo[(i + 2) % diapo.length]!
    prossima.querySelectorAll('img').forEach(caricaVera)
    const mostra = () => {
      diapo[i]?.classList.remove('attiva')
      diapo[i]?.setAttribute('aria-hidden', 'true')
      prossima.classList.add('attiva')
      prossima.removeAttribute('aria-hidden')
      // Prepara già la successiva, così è pronta al giro dopo.
      dopo.querySelectorAll('img').forEach(caricaVera)
    }
    const prima = prossima.querySelector('img')
    if (prima && !prima.complete) prima.addEventListener('load', mostra, { once: true })
    else mostra()
  }

  const avvia = () => {
    clearInterval(timer)
    if (!fermo && !ridotto.matches) timer = window.setInterval(avanza, INTERVALLO)
  }

  if (pulsante) {
    pulsante.hidden = false
    const etichetta = pulsante.querySelector('span')!
    const aggiornaPulsante = () => {
      const manuale = ridotto.matches
      pulsante.dataset.stato = manuale ? 'avanti' : fermo ? 'fermo' : 'scorre'
      pulsante.setAttribute('aria-pressed', String(!manuale && fermo))
      etichetta.textContent = manuale
        ? 'Foto successiva'
        : fermo
          ? 'Riprendi lo scorrimento delle foto'
          : 'Ferma lo scorrimento delle foto'
    }
    pulsante.addEventListener('click', () => {
      if (ridotto.matches) avanza()
      else {
        fermo = !fermo
        avvia()
      }
      aggiornaPulsante()
    })
    ridotto.addEventListener('change', () => {
      avvia()
      aggiornaPulsante()
    })
    aggiornaPulsante()
  }
  // Si ferma quando la scheda non è visibile.
  document.addEventListener('visibilitychange', () =>
    document.hidden ? clearInterval(timer) : avvia(),
  )
  avvia()
}
