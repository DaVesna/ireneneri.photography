// Unico punto di accesso ai dati di Sanity per il sito.
// Sola lettura, nessun token: il dataset è pubblico e il sito legge solo i contenuti pubblicati.
import { createClient, type QueryParams } from '@sanity/client'
import type { PortableTextBlock } from '@portabletext/types'

export const PROJECT_ID = '10o0605j'
export const DATASET = 'production'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-11-01',
  useCdn: true,
  perspective: 'published',
  // Nessun token, mai: le bozze restano invisibili al sito.
})

// ------------------------------------------------------------------ tipi

export type Colore = { background: string; foreground: string; population: number }
export type Palette = Partial<
  Record<
    'dominant' | 'vibrant' | 'darkVibrant' | 'lightVibrant' | 'muted' | 'darkMuted' | 'lightMuted',
    Colore
  >
>

export type Immagine = {
  _key?: string
  alt?: string
  didascalia?: string
  hotspot?: { x: number; y: number; width: number; height: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  asset: {
    _id: string
    larghezza: number
    altezza: number
    lqip?: string
    palette?: Palette
  }
}

export type Categoria = {
  _id: string
  titolo: string
  slug: string
  descrizione?: string
  ordine?: number
}

export type AlbumBreve = {
  _id: string
  titolo: string
  slug: string
  data: string
  luogo?: string
  categoria?: Categoria
  copertina: Immagine
  testo?: PortableTextBlock[]
  numeroFoto: number
}

export type Album = AlbumBreve & { foto: Immagine[] }

export type Impostazioni = {
  nomeSito?: string
  descrizione?: string
  immagineCondivisione?: Immagine
  testoPiede?: string
}

export type Contatti = { testoIntroduttivo?: string; emailPubblica?: string; instagram?: string }

export type ChiSono = {
  titolo?: string
  presentazioneBreve?: string
  testo?: PortableTextBlock[]
  ritratto?: Immagine
  fotoAggiuntive?: Immagine[]
}

export type Home = {
  fotoBenvenuto: Immagine[]
  fraseBenvenuto?: string | undefined
  albumInEvidenza: AlbumBreve[]
}

export type Privacy = { titolo?: string; testo?: PortableTextBlock[] }

// ------------------------------------------------------------------ proiezioni GROQ

const IMMAGINE = `{
  _key, alt, didascalia, hotspot, crop,
  "asset": asset->{
    _id,
    "larghezza": metadata.dimensions.width,
    "altezza": metadata.dimensions.height,
    "lqip": metadata.lqip,
    "palette": metadata.palette
  }
}`

const ALBUM_BREVE = `{
  _id, titolo, "slug": slug.current, data, luogo, testo,
  "categoria": categoria->{ _id, titolo, "slug": slug.current, descrizione, ordine },
  "copertina": copertina${IMMAGINE},
  "numeroFoto": count(foto)
}`

// Solo documenti completi: un album senza slug o copertina non va in pagina.
const ALBUM_VALIDO = `_type == "album" && defined(slug.current) && defined(copertina.asset) && defined(data)`

// ------------------------------------------------------------------ query

// Cache per la durata del build: ogni query parte una sola volta anche se più pagine la usano.
const cache = new Map<string, Promise<unknown>>()
function query<T>(groq: string, params: QueryParams = {}): Promise<T> {
  const chiave = groq + JSON.stringify(params)
  if (!cache.has(chiave)) cache.set(chiave, client.fetch<T>(groq, params))
  return cache.get(chiave) as Promise<T>
}

export const leggiImpostazioni = () =>
  query<Impostazioni | null>(
    `*[_id == "impostazioni"][0]{ nomeSito, descrizione, testoPiede, "immagineCondivisione": immagineCondivisione${IMMAGINE} }`,
  )

export const leggiContatti = () =>
  query<Contatti | null>(`*[_id == "contatti"][0]{ testoIntroduttivo, emailPubblica, instagram }`)

export const leggiChiSono = () =>
  query<ChiSono | null>(
    `*[_id == "chiSono"][0]{ titolo, presentazioneBreve, testo, "ritratto": ritratto${IMMAGINE}, "fotoAggiuntive": fotoAggiuntive[]${IMMAGINE} }`,
  )

export const leggiPrivacy = () => query<Privacy | null>(`*[_id == "privacy"][0]{ titolo, testo }`)

export const leggiHome = async (): Promise<Home> => {
  const h = await query<Partial<Home> | null>(
    `*[_id == "home"][0]{
      "fotoBenvenuto": fotoBenvenuto[defined(asset)]${IMMAGINE},
      fraseBenvenuto,
      "albumInEvidenza": albumInEvidenza[]->[${ALBUM_VALIDO}]${ALBUM_BREVE}
    }`,
  )
  return {
    fotoBenvenuto: h?.fotoBenvenuto ?? [],
    fraseBenvenuto: h?.fraseBenvenuto,
    albumInEvidenza: h?.albumInEvidenza ?? [],
  }
}

/** Tutti gli album pubblicati e completi, dal più recente. */
export const leggiAlbum = () =>
  query<AlbumBreve[]>(`*[${ALBUM_VALIDO}] | order(data desc, titolo asc) ${ALBUM_BREVE}`)

/** Un album con tutte le foto. */
export const leggiAlbumCompleto = (slug: string) =>
  query<Album | null>(
    `*[${ALBUM_VALIDO} && slug.current == $slug][0]{ ...${ALBUM_BREVE}, "foto": foto[defined(asset)]${IMMAGINE} }`,
    { slug },
  )

/** Categorie che hanno almeno un album pubblicato, nell'ordine scelto da Irene. */
export const leggiCategorieUsate = () =>
  query<Categoria[]>(
    `*[_type == "categoria" && count(*[${ALBUM_VALIDO} && references(^._id)]) > 0] | order(ordine asc, titolo asc){ _id, titolo, "slug": slug.current, descrizione, ordine }`,
  )
