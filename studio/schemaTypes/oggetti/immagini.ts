import { defineField, defineType } from 'sanity'
import { avvisoFotoGrande } from '../../lib/validazioni'

// Opzioni comuni a tutte le immagini:
// - hotspot: Irene sceglie il punto da tenere sempre in vista quando la foto viene inquadrata;
// - metadati: solo anteprima sfocata (lqip) e palette dei colori. EXIF e posizione GPS non vengono
//   estratti, perché il dataset è leggibile da chiunque;
// - il nome originale del file non viene salvato.
export const opzioniImmagine = {
  hotspot: true,
  metadata: ['lqip', 'palette'] as ('lqip' | 'palette')[],
  storeOriginalFilename: false,
  accept: 'image/jpeg,image/png,image/webp',
}

const testoAlternativo = (obbligatorio: boolean) =>
  defineField({
    name: 'alt',
    title: obbligatorio ? 'Testo alternativo' : 'Testo alternativo (facoltativo)',
    type: 'string',
    description:
      'Descrive la foto a chi non la vede (per esempio chi usa un lettore di schermo). Una frase breve su cosa si vede. Esempio: "Ballerina a testa in giù sul palo, davanti a una finestra".',
    validation: (r) => {
      const base = r.max(160).warning('Meglio stare sotto i 160 caratteri.')
      return obbligatorio
        ? [r.required().error('Scrivi una frase che descriva la foto.'), base]
        : [base]
    },
  })

/** Immagine con testo alternativo obbligatorio (copertine, ritratto, foto di benvenuto). */
export const immagineConAlt = defineType({
  name: 'immagineConAlt',
  title: 'Foto',
  type: 'image',
  options: opzioniImmagine,
  fields: [testoAlternativo(true)],
  validation: (r) => r.custom(avvisoFotoGrande).warning(),
})

/** Foto di un album: testo alternativo e didascalia facoltativi. */
export const fotoAlbum = defineType({
  name: 'fotoAlbum',
  title: 'Foto',
  type: 'image',
  options: opzioniImmagine,
  fields: [
    testoAlternativo(false),
    defineField({
      name: 'didascalia',
      title: 'Didascalia (facoltativa)',
      type: 'string',
      description:
        'Compare sotto la foto nel visore a tutto schermo. Esempio: "Il riscaldamento prima dello spettacolo".',
      validation: (r) => r.max(200).warning('Meglio stare sotto i 200 caratteri.'),
    }),
  ],
  validation: (r) => r.custom(avvisoFotoGrande).warning(),
  preview: {
    select: { media: 'asset', alt: 'alt', didascalia: 'didascalia' },
    prepare: ({ media, alt, didascalia }) => ({ media, title: didascalia || alt || 'Foto' }),
  },
})
