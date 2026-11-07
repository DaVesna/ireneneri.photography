import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'
import { caratteriTesto } from '../lib/validazioni'

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']

export const album = defineType({
  name: 'album',
  title: 'Album',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'titolo',
      title: 'Titolo',
      type: 'string',
      description: 'Il nome dell’album, breve. Esempio: "Teatro di Monfalcone".',
      validation: (r) => [
        r.required().error('Dai un titolo all’album.'),
        r.max(60).warning('Un titolo più corto si legge meglio: stai sotto i 60 caratteri.'),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Indirizzo della pagina',
      type: 'slug',
      description:
        'La parte finale dell’indirizzo web dell’album. Premi "Genera" per crearlo dal titolo. Dopo la pubblicazione è meglio non cambiarlo, perché i link già condivisi smetterebbero di funzionare.',
      options: { source: 'titolo', maxLength: 80 },
      validation: (r) => r.required().error('Premi "Genera" per creare l’indirizzo dal titolo.'),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'categoria' }],
      description: 'Serve per il filtro nella pagina degli album. Esempio: Sport.',
      options: { disableNew: true },
    }),
    defineField({
      name: 'data',
      title: 'Data',
      type: 'date',
      description: 'Il giorno dell’evento o del servizio (se dura più giorni, il primo).',
      options: { dateFormat: 'D MMMM YYYY' },
      validation: (r) => r.required().error('Indica la data dell’evento.'),
    }),
    defineField({
      name: 'luogo',
      title: 'Luogo (facoltativo)',
      type: 'string',
      description: 'Città o posto. Esempio: "Monfalcone". Lascia vuoto se non vuoi indicarlo.',
      validation: (r) => r.max(60).warning('Basta il nome del posto, sotto i 60 caratteri.'),
    }),
    defineField({
      name: 'copertina',
      title: 'Copertina',
      type: 'immagineConAlt',
      description:
        'La foto che rappresenta l’album: apre la pagina e dà il colore di sfondo. Dopo averla caricata, clicca sulla matita per scegliere il punto da tenere sempre in vista.',
      validation: (r) => r.required().error('Scegli una foto di copertina.'),
    }),
    defineField({
      name: 'testo',
      title: 'Testo',
      type: 'testoSemplice',
      description:
        'Due-quattro frasi su cosa si vede nell’album. Esempio: "Pole dance sul palco, con la band che suona alle spalle."',
      validation: (r) =>
        r.custom((v) =>
          caratteriTesto(v as never) > 1200
            ? 'Il testo è lungo: tienilo sotto i 1200 caratteri (circa 4–6 frasi).'
            : true,
        ),
    }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'array',
      description:
        'Trascina qui tutte le foto insieme, dalla cartella del computer. Per cambiare l’ordine, trascina le miniature. Se una foto non ha testo alternativo, il sito usa "Titolo, foto 3 di 20".',
      of: [defineArrayMember({ type: 'fotoAlbum' })],
      options: { layout: 'grid' },
      validation: (r) => r.required().min(1).error('Carica almeno una foto.'),
    }),
  ],
  orderings: [
    {
      title: 'Data, più recenti prima',
      name: 'dataDesc',
      by: [{ field: 'data', direction: 'desc' }],
    },
    { title: 'Data, più vecchi prima', name: 'dataAsc', by: [{ field: 'data', direction: 'asc' }] },
    { title: 'Titolo', name: 'titolo', by: [{ field: 'titolo', direction: 'asc' }] },
  ],
  preview: {
    select: {
      titolo: 'titolo',
      data: 'data',
      media: 'copertina',
      categoria: 'categoria.titolo',
      foto: 'foto',
    },
    prepare: ({ titolo, data, media, categoria, foto }) => {
      const [a, m, g] = String(data ?? '').split('-')
      const quando = a ? `${Number(g)} ${MESI[Number(m) - 1]} ${a}` : 'senza data'
      const n = Array.isArray(foto) ? foto.length : 0
      return {
        title: titolo || 'Album senza titolo',
        subtitle: [quando, categoria, `${n} foto`].filter(Boolean).join(', '),
        media,
      }
    },
  },
})
