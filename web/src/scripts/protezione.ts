// Deterrenti contro il "salva immagine con nome". Non sono una protezione vera (uno screenshot
// resta sempre possibile): la protezione vera è che il sito serve solo versioni ridotte.
// Non toccano tastiera, focus né lettori di schermo.
const suFoto = (t: EventTarget | null) =>
  t instanceof Element && Boolean(t.closest('img, picture, .visore'))

document.addEventListener('contextmenu', (e) => {
  if (suFoto(e.target)) e.preventDefault()
})
document.addEventListener('dragstart', (e) => {
  if (suFoto(e.target)) e.preventDefault()
})
