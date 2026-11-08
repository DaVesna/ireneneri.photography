import { album } from './album'
import { categoria } from './categoria'
import { chiSono, contatti, home, impostazioni, privacy } from './singoli'
import { fotoAlbum, immagineConAlt } from './oggetti/immagini'
import { testoSemplice, testoStrutturato } from './oggetti/testo'

export const schemaTypes = [
  home,
  album,
  categoria,
  chiSono,
  contatti,
  privacy,
  impostazioni,
  immagineConAlt,
  fotoAlbum,
  testoSemplice,
  testoStrutturato,
]
