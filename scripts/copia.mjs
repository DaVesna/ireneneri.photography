// Copia le foto dall'originale alla cartella di lavoro secondo il piano album.
//
//   npm run foto:copia
//
// Struttura creata:  <LAVORO>/album/<slug>/<slug>-01.jpg, -02.jpg, ...  (ordine = ordine di scatto)
// più <LAVORO>/album/<slug>/elenco.json con la corrispondenza nome nuovo → file originale.
// L'originale viene solo letto. Rilanciabile: le copie già identiche non vengono riscritte.
import fs from 'node:fs/promises'
import path from 'node:path'
import { ORIGINALI, LAVORO, vietaScritturaNegliOriginali } from './lib/percorsi.mjs'
import { sha256 } from './lib/file.mjs'
import { leggiPiano, fotoOrdinate, cartellaLavoro, nomeNormalizzato } from './lib/piano.mjs'

const piano = await leggiPiano()
let copiate = 0
let saltate = 0
/** @type {{ originale: string, copia: string }[]} */
const tutte = []

for (const album of piano.album) {
  const dest = cartellaLavoro(album.slug)
  vietaScritturaNegliOriginali(dest)
  await fs.mkdir(dest, { recursive: true })
  const foto = await fotoOrdinate(album)
  const elenco = []
  for (const [i, f] of foto.entries()) {
    const nome = nomeNormalizzato(album.slug, i)
    const copia = path.join(dest, nome)
    vietaScritturaNegliOriginali(copia)
    const stOrig = await fs.stat(f.originale)
    const stCopia = await fs.stat(copia).catch(() => null)
    if (stCopia && stCopia.size === stOrig.size) saltate++
    else {
      // COPYFILE_EXCL non serve: la destinazione è sempre nella cartella di lavoro.
      await fs.copyFile(f.originale, copia)
      copiate++
    }
    elenco.push({
      nome,
      originale: path.relative(ORIGINALI, f.originale).split(path.sep).join('/'),
      scatto: f.scatto,
    })
    tutte.push({ originale: f.originale, copia })
  }
  // Rimuove copie in più rimaste da un piano precedente.
  const attesi = new Set([...elenco.map((e) => e.nome), 'elenco.json'])
  for (const nome of await fs.readdir(dest)) {
    if (!attesi.has(nome)) await fs.rm(path.join(dest, nome))
  }
  await fs.writeFile(
    path.join(dest, 'elenco.json'),
    JSON.stringify({ ...album, foto: elenco }, null, 2),
  )
  console.log(`${album.slug.padEnd(24)} ${String(foto.length).padStart(3)} foto`)
}

// Verifica: stesso numero di file e checksum su un campione (una foto ogni 5, più prima e ultima).
const nCopie = (
  await Promise.all(
    piano.album.map(
      async (a) =>
        (await fs.readdir(cartellaLavoro(a.slug))).filter((n) => n.endsWith('.jpg')).length,
    ),
  )
).reduce((s, n) => s + n, 0)
if (nCopie !== tutte.length) {
  console.error(`ERRORE: attese ${tutte.length} foto nella copia, trovate ${nCopie}.`)
  process.exit(1)
}
const campione = tutte.filter((_, i) => i % 5 === 0 || i === tutte.length - 1)
for (const { originale, copia } of campione) {
  const [a, b] = await Promise.all([sha256(originale), sha256(copia)])
  if (a !== b) {
    console.error(`ERRORE: checksum diverso per ${copia}`)
    process.exit(1)
  }
}
console.log(
  `\nCopia in ${path.join(LAVORO, 'album')}: ${tutte.length} foto (${copiate} copiate, ${saltate} già presenti).` +
    `\nVerifica: conteggio identico, checksum SHA-256 identico su ${campione.length} foto di campione.`,
)
