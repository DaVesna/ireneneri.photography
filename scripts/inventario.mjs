// Inventario delle foto originali, in SOLA LETTURA.
//
//   npm run foto:inventario              impronta iniziale + inventario in docs/inventario-foto.md
//   npm run foto:inventario -- --verifica  confronta l'originale con l'impronta iniziale
//
// Lo script non scrive nulla dentro la cartella degli originali: apre i file solo in lettura.
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import exifr from 'exifr'
import { ORIGINALI, DOCS, RADICE_REPO, vietaScritturaNegliOriginali } from './lib/percorsi.mjs'
import { elencaFile, impronta, formattaPeso, isFileDiSistema } from './lib/file.mjs'

const FILE_IMPRONTA = path.join(RADICE_REPO, 'src', 'photos', 'impronta-originale.json')
const FILE_INVENTARIO = path.join(DOCS, 'inventario-foto.md')
const FILE_DATI = path.join(RADICE_REPO, 'src', 'photos', 'inventario-originale.json')

sharp.cache(false)

async function verifica() {
  const salvata = JSON.parse(await fs.readFile(FILE_IMPRONTA, 'utf8'))
  const attuale = await impronta(ORIGINALI)
  const differenze = []
  if (salvata.conteggio !== attuale.conteggio) {
    differenze.push(`numero di file: ${salvata.conteggio} → ${attuale.conteggio}`)
  }
  const prima = new Map(salvata.file.map((/** @type {any} */ f) => [f.percorso, f]))
  const dopo = new Map(attuale.file.map((f) => [f.percorso, f]))
  for (const [p, f] of prima) {
    const g = dopo.get(p)
    if (!g) differenze.push(`mancante: ${p}`)
    else if (g.dimensione !== f.dimensione || g.modificato !== f.modificato)
      differenze.push(`modificato: ${p}`)
  }
  for (const p of dopo.keys()) if (!prima.has(p)) differenze.push(`nuovo: ${p}`)
  if (differenze.length) {
    console.error('ATTENZIONE: l’originale è cambiato rispetto all’impronta iniziale.')
    for (const d of differenze) console.error('  ' + d)
    process.exit(1)
  }
  console.log(
    `Originale intatto: ${attuale.conteggio} file, identici all'impronta del ${salvata.creata}.`,
  )
}

/**
 * @typedef {{
 *   percorso: string, cartella: string, nome: string, dimensione: number,
 *   tipo: 'foto' | 'sistema' | 'altro', larghezza?: number, altezza?: number,
 *   formato?: string, orientamento?: number, spazioColore?: string, profilo?: boolean,
 *   scatto?: string | null, fotocamera?: string | null, gps?: boolean, problema?: string
 * }} Voce
 */

/** @param {{percorso: string, dimensione: number}} f @returns {Promise<Voce>} */
async function analizza(f) {
  const assoluto = path.join(ORIGINALI, f.percorso)
  const cartella = path.dirname(f.percorso).split(path.sep).join('/')
  const nome = path.basename(f.percorso)
  /** @type {Voce} */
  const voce = {
    percorso: f.percorso.split(path.sep).join('/'),
    cartella,
    nome,
    dimensione: f.dimensione,
    tipo: 'altro',
  }
  if (isFileDiSistema(nome)) {
    voce.tipo = 'sistema'
    voce.problema = nome.startsWith('._')
      ? 'file nascosto di macOS (AppleDouble)'
      : 'file di sistema'
    return voce
  }
  try {
    const meta = await sharp(assoluto).metadata()
    voce.formato = meta.format
    voce.larghezza = meta.width
    voce.altezza = meta.height
    voce.orientamento = meta.orientation
    voce.spazioColore = meta.space
    voce.profilo = Boolean(meta.icc)
    voce.tipo = 'foto'
    if (meta.format !== 'jpeg') voce.problema = `formato ${meta.format}`
  } catch {
    voce.problema = 'non è un’immagine leggibile'
    return voce
  }
  try {
    const exif = await exifr.parse(assoluto, {
      pick: ['DateTimeOriginal', 'CreateDate', 'Make', 'Model', 'latitude', 'longitude'],
      gps: true,
    })
    const data = exif?.DateTimeOriginal ?? exif?.CreateDate
    voce.scatto = data instanceof Date ? toLocalIso(data) : null
    voce.fotocamera = [exif?.Make, exif?.Model].filter(Boolean).join(' ') || null
    voce.gps = exif?.latitude != null
  } catch {
    voce.scatto = null
  }
  if (!voce.scatto && !voce.problema) voce.problema = 'nessuna data di scatto EXIF'
  return voce
}

/** Data EXIF (ora locale della fotocamera) senza conversioni di fuso. @param {Date} d */
function toLocalIso(d) {
  const p = (/** @type {number} */ n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

async function inventario() {
  // 1. Impronta iniziale, solo se non esiste già: è il riferimento per il controllo finale.
  let improntaSalvata
  try {
    improntaSalvata = JSON.parse(await fs.readFile(FILE_IMPRONTA, 'utf8'))
    console.log(`Impronta iniziale già presente (${improntaSalvata.creata}): non la sovrascrivo.`)
  } catch {
    vietaScritturaNegliOriginali(FILE_IMPRONTA)
    improntaSalvata = await impronta(ORIGINALI)
    await fs.mkdir(path.dirname(FILE_IMPRONTA), { recursive: true })
    await fs.writeFile(FILE_IMPRONTA, JSON.stringify(improntaSalvata, null, 2))
    console.log(`Impronta iniziale salvata: ${improntaSalvata.conteggio} file.`)
  }

  // 2. Analisi file per file.
  const file = await elencaFile(ORIGINALI)
  /** @type {Voce[]} */
  const voci = []
  for (const f of file) voci.push(await analizza(f))

  // 3. Aggregato per cartella.
  /** @type {Map<string, Voce[]>} */
  const perCartella = new Map()
  for (const v of voci) {
    if (!perCartella.has(v.cartella)) perCartella.set(v.cartella, [])
    perCartella.get(v.cartella)?.push(v)
  }
  // Includi anche le cartelle vuote.
  for (const c of await elencaCartelle(ORIGINALI)) if (!perCartella.has(c)) perCartella.set(c, [])

  const righe = []
  righe.push('# Inventario delle foto originali', '')
  righe.push(
    `Generato da \`npm run foto:inventario\` il ${toLocalIso(new Date())}. Cartella letta in sola lettura.`,
    '',
  )
  const foto = voci.filter((v) => v.tipo === 'foto')
  righe.push(
    `Totale: ${voci.length} file, di cui ${foto.length} foto (${formattaPeso(foto.reduce((s, v) => s + v.dimensione, 0))}), ` +
      `${voci.filter((v) => v.tipo === 'sistema').length} file di sistema, ${voci.filter((v) => v.tipo === 'altro').length} altri file.`,
    '',
  )

  righe.push('## Albero delle cartelle', '', '```')
  for (const c of [...perCartella.keys()].sort()) {
    const livello = c === '.' ? 0 : c.split('/').length
    const n = (perCartella.get(c) ?? []).filter((v) => v.tipo === 'foto').length
    righe.push(
      `${'  '.repeat(livello)}${c === '.' ? '(radice)' : path.posix.basename(c)}/${n ? `  — ${n} foto` : ''}`,
    )
  }
  righe.push('```', '')

  righe.push('## Per cartella', '')
  righe.push(
    '| Cartella | Foto | Peso | Lato lungo min–max | Orizz./Vert. | Primo scatto | Ultimo scatto | Fotocamera | GPS |',
  )
  righe.push('|---|---:|---:|---|---|---|---|---|---|')
  for (const c of [...perCartella.keys()].sort()) {
    const fs_ = (perCartella.get(c) ?? []).filter((v) => v.tipo === 'foto')
    if (!fs_.length) continue
    const lati = fs_.map((v) => Math.max(v.larghezza ?? 0, v.altezza ?? 0))
    const orizz = fs_.filter((v) => isOrizzontale(v)).length
    const date = fs_
      .map((v) => v.scatto)
      .filter(Boolean)
      .sort()
    const camere = [...new Set(fs_.map((v) => v.fotocamera).filter(Boolean))].join(', ') || '—'
    const gps = fs_.filter((v) => v.gps).length
    righe.push(
      `| ${c} | ${fs_.length} | ${formattaPeso(fs_.reduce((s, v) => s + v.dimensione, 0))} | ${Math.min(...lati)}–${Math.max(...lati)} px | ${orizz}/${fs_.length - orizz} | ${date[0] ?? '—'} | ${date.at(-1) ?? '—'} | ${camere} | ${gps ? `${gps} con GPS` : 'no'} |`,
    )
  }
  righe.push('')

  const anomali = voci.filter((v) => v.problema)
  righe.push('## File non JPEG o anomali', '')
  if (!anomali.length) righe.push('Nessuno.')
  else {
    /** @type {Map<string, Voce[]>} */
    const perProblema = new Map()
    for (const v of anomali) {
      const k = `${v.cartella} — ${v.problema}`
      if (!perProblema.has(k)) perProblema.set(k, [])
      perProblema.get(k)?.push(v)
    }
    righe.push('| Cartella e problema | File | Esempi |', '|---|---:|---|')
    for (const [k, vs] of [...perProblema].sort()) {
      righe.push(
        `| ${k} | ${vs.length} | ${vs
          .slice(0, 3)
          .map((v) => `\`${v.nome}\` (${formattaPeso(v.dimensione)})`)
          .join(', ')} |`,
      )
    }
  }
  righe.push('')

  await fs.writeFile(FILE_INVENTARIO, righe.join('\n'))
  await fs.writeFile(FILE_DATI, JSON.stringify(voci, null, 2))
  console.log(
    `Inventario scritto in ${path.relative(RADICE_REPO, FILE_INVENTARIO)} (${foto.length} foto).`,
  )
}

/** @param {Voce} v */
function isOrizzontale(v) {
  const w = v.larghezza ?? 0
  const h = v.altezza ?? 0
  const ruotata = (v.orientamento ?? 1) >= 5
  return ruotata ? h > w : w > h
}

/** @param {string} radice @returns {Promise<string[]>} */
async function elencaCartelle(radice) {
  const out = ['.']
  /** @param {string} dir */
  async function giro(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        const p = path.join(dir, e.name)
        out.push(path.relative(radice, p).split(path.sep).join('/'))
        await giro(p)
      }
    }
  }
  await giro(radice)
  return out
}

if (process.argv.includes('--verifica')) await verifica()
else await inventario()
