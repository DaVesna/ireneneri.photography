/* Prototipo: rende le pagine a partire da window.DATI (generato da prepara.mjs). */
const D = window.DATI
const img = (i, alt, extra = '') =>
  `<img src="${i.src}" width="${i.w}" height="${i.h}" style="--r:${(i.w / i.h).toFixed(4)}" alt="${alt}" loading="lazy" decoding="async" draggable="false" ${extra}>`
const tinta = (t) => `--fondo:${t.fondo};--chiaro:${t.chiaro};--secondario:${t.secondario}`
const ridotto = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function striscia(box, comandi, contatore) {
  const pad = () => parseFloat(getComputedStyle(box).scrollPaddingLeft) || 0
  const passo = (dir) => {
    const figli = [...box.children]
    const x = box.scrollLeft
    const target =
      dir > 0
        ? figli.find((f) => f.offsetLeft - pad() > x + 4)
        : figli.findLast((f) => f.offsetLeft - pad() < x - 4)
    if (target)
      box.scrollTo({ left: target.offsetLeft - pad(), behavior: ridotto() ? 'auto' : 'smooth' })
  }
  const bottoni = comandi ? [...comandi.querySelectorAll('[data-dir]')] : []
  bottoni.forEach((b) => b.addEventListener('click', () => passo(+b.dataset.dir)))
  const aggiorna = () => {
    const max = box.scrollWidth - box.clientWidth - 2
    if (bottoni[0]) bottoni[0].disabled = box.scrollLeft <= 2
    if (bottoni[1]) bottoni[1].disabled = box.scrollLeft >= max
    if (contatore) {
      const i = [...box.children].findIndex((f) => f.offsetLeft - pad() >= box.scrollLeft - 4)
      contatore.textContent = `${Math.max(1, i + 1)} / ${box.children.length}`
    }
  }
  box.addEventListener('scroll', aggiorna, { passive: true })
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      passo(1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      passo(-1)
    }
  })
  aggiorna()
}

document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('img, .visore')) e.preventDefault()
})

const benv = document.getElementById('benvenuto')
if (benv) {
  benv.innerHTML = D.benvenuto.map((i) => img(i, 'Foto di benvenuto')).join('')
  striscia(benv, document.querySelector('.sotto-striscia .comandi'))
  document.getElementById('capitoli').innerHTML = D.capitoli
    .map((c) => {
      const vert = c.img.h > c.img.w
      const href = c.slug === 'no-border-village' ? 'album.html' : '#'
      const testo = `<div class="testo"><div><h2 class="titolo"><a href="${href}">${c.titolo}</a></h2><p class="dati">${c.data}${c.luogo ? ', ' + c.luogo : ''}</p></div><div><p class="descrizione">${c.testo}</p><a class="vai" href="${href}">Guarda l’album, ${c.foto} foto</a></div></div>`
      const foto = `<a class="foto-link" href="${href}" tabindex="-1" aria-hidden="true">${img(c.img, '', `data-vt="copertina-${c.slug}"`)}</a>`
      return `<section class="capitolo ${vert ? 'verticale' : 'orizzontale'}" style="${tinta(c.tinta)}"><div class="dentro">${vert ? testo + foto : foto + testo}</div></section>`
    })
    .join('')
}

const main = document.getElementById('album')
if (main) {
  const a = D.album
  document.body.setAttribute('style', tinta(a.tinta))
  const n = a.foto.length
  main.innerHTML = `
    <section class="apertura">
      ${img(a.img, 'Ballerina inclinata sul palo all’aperto, in un campo da basket', `data-vt="copertina-${a.slug}" loading="eager" fetchpriority="high"`)}
      <div>
        <h1 class="titolo">${a.titolo}</h1>
        <p class="dati">${a.data}</p>
        <a class="categoria" href="#">Sport</a>
        <div class="prosa">${a.testoCompleto.map((p) => `<p>${p}</p>`).join('')}</div>
      </div>
    </section>
    <section class="carosello" aria-label="Foto dell’album">
      <div class="striscia" tabindex="0">${a.foto.map((f, i) => `<button class="foto" type="button" id="foto-${i + 1}" data-i="${i}" aria-label="Apri la foto ${i + 1} di ${n}">${img(f.grande, `${a.titolo}, foto ${i + 1} di ${n}`)}</button>`).join('')}</div>
      <div class="sotto-striscia"><span class="contatore"></span><div class="comandi"><button type="button" data-dir="-1" aria-label="Foto precedente">‹</button><button type="button" data-dir="1" aria-label="Foto successiva">›</button></div></div>
    </section>
    <details class="insieme"><summary>Tutte le foto</summary><div class="miniature">${a.foto.map((f, i) => `<a href="#foto-${i + 1}">${img(f.mini, `Foto ${i + 1}`)}</a>`).join('')}</div></details>
    <a class="successivo" href="#" style="${tinta(a.successivo.tinta)};background:var(--fondo)"><span>Album successivo</span><strong>${a.successivo.titolo}</strong></a>`
  const box = main.querySelector('.carosello .striscia')
  striscia(
    box,
    main.querySelector('.carosello .comandi'),
    main.querySelector('.carosello .contatore'),
  )
  const v = document.getElementById('visore')
  let cur = 0
  const mostra = (i) => {
    cur = (i + n) % n
    const f = a.foto[cur].grande
    const im = v.querySelector('img')
    im.src = f.src
    im.width = f.w
    im.height = f.h
    im.alt = `${a.titolo}, foto ${cur + 1} di ${n}`
    v.querySelector('.contatore').textContent = `${cur + 1} / ${n}`
  }
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button.foto')
    if (b) {
      mostra(+b.dataset.i)
      v.showModal()
    }
  })
  v.querySelectorAll('[data-v]').forEach((b) =>
    b.addEventListener('click', () => mostra(cur + +b.dataset.v)),
  )
  v.querySelector('.chiudi').addEventListener('click', () => v.close())
  v.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') mostra(cur + 1)
    if (e.key === 'ArrowLeft') mostra(cur - 1)
  })
}

document.querySelectorAll('[data-vt]').forEach((i) => (i.style.viewTransitionName = i.dataset.vt))
