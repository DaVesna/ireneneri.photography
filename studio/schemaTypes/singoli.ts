import { defineArrayMember, defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'
import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { HomeIcon } from '@sanity/icons/Home'
import { LockIcon } from '@sanity/icons/Lock'
import { UserIcon } from '@sanity/icons/User'
import { caratteriTesto } from '../lib/validazioni'

export const home = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'fotoBenvenuto',
      title: 'Foto di benvenuto',
      type: 'array',
      description:
        'Da 3 a 10 foto, mostrate in fila in cima alla home. Trascinale per cambiare l’ordine. Meglio non usare le copertine degli album in evidenza, che compaiono più sotto.',
      of: [defineArrayMember({ type: 'immagineConAlt' })],
      options: { layout: 'grid' },
      validation: (r) => [
        r.required().min(3).error('Servono almeno 3 foto di benvenuto.'),
        r.max(10).error('Al massimo 10 foto: togline qualcuna.'),
      ],
    }),
    defineField({
      name: 'fraseBenvenuto',
      title: 'Frase sotto le foto (facoltativa)',
      type: 'string',
      description:
        'Una riga breve. Si può lasciare vuota. Esempio: "Sport da vicino, in palestra e sul palco".',
      validation: (r) => r.max(140).error('Al massimo 140 caratteri.'),
    }),
    defineField({
      name: 'albumInEvidenza',
      title: 'Album in evidenza',
      type: 'array',
      description: 'Gli album mostrati in grande nella home, nell’ordine scelto qui. Al massimo 6.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'album' }],
          options: { disableNew: true },
        }),
      ],
      validation: (r) => [
        r.max(6).error('Al massimo 6 album in evidenza.'),
        r.unique().error('Lo stesso album compare due volte.'),
      ],
    }),
    defineField({
      name: 'invito',
      title: 'Invito a scrivere',
      type: 'string',
      description:
        'La frase in fondo alla home, prima del link ai contatti. Esempio: "Per un servizio, una gara o anche solo una domanda, scrivimi."',
      validation: (r) => r.max(160).warning('Basta una frase, sotto i 160 caratteri.'),
    }),
  ],
  preview: { prepare: () => ({ title: 'Home' }) },
})

export const chiSono = defineType({
  name: 'chiSono',
  title: 'Chi sono',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'titolo',
      title: 'Titolo della pagina',
      type: 'string',
      initialValue: 'Chi sono',
      validation: (r) => r.max(60),
    }),
    defineField({
      name: 'presentazioneBreve',
      title: 'Presentazione breve (per la home)',
      type: 'text',
      rows: 3,
      description:
        'Due o tre frasi in prima persona, mostrate nella home accanto al ritratto. Esempio: "Sono Irene, fotografa. Lavoro soprattutto con lo sport…"',
      validation: (r) => r.max(320).warning('Tienila breve: sotto i 320 caratteri.'),
    }),
    defineField({
      name: 'testo',
      title: 'Testo',
      type: 'testoSemplice',
      description: 'Il testo completo della pagina Chi sono.',
      validation: (r) =>
        r
          .custom((v) =>
            caratteriTesto(v as never) > 2500
              ? 'Il testo è lungo: prova a stare sotto i 2500 caratteri.'
              : true,
          )
          .warning(),
    }),
    defineField({
      name: 'ritratto',
      title: 'Ritratto',
      type: 'immagineConAlt',
      description: 'Una tua foto. Compare nella pagina Chi sono e, più piccola, nella home.',
      validation: (r) => r.required().error('Carica un tuo ritratto.'),
    }),
    defineField({
      name: 'fotoAggiuntive',
      title: 'Altre foto (facoltative)',
      type: 'array',
      of: [defineArrayMember({ type: 'immagineConAlt' })],
      options: { layout: 'grid' },
      validation: (r) => r.max(6),
    }),
  ],
  preview: { prepare: () => ({ title: 'Chi sono' }) },
})

export const contatti = defineType({
  name: 'contatti',
  title: 'Contatti',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'testoIntroduttivo',
      title: 'Testo introduttivo',
      type: 'text',
      rows: 3,
      description:
        'Compare sopra il modulo dei contatti. Esempio: "Scrivimi per un servizio, una gara o una domanda: rispondo entro un paio di giorni."',
      validation: (r) => r.max(400),
    }),
    defineField({
      name: 'emailPubblica',
      title: 'Email da mostrare sul sito',
      type: 'string',
      description:
        'Visibile a tutti. I messaggi del modulo arrivano a un indirizzo impostato a parte, non qui.',
      validation: (r) => r.email().error('Non sembra un indirizzo email valido.'),
    }),
    defineField({
      name: 'instagram',
      title: 'Profilo Instagram',
      type: 'url',
      description: 'L’indirizzo completo. Esempio: https://www.instagram.com/nomeprofilo',
      validation: (r) =>
        r.uri({ scheme: ['https'] }).error('Incolla l’indirizzo completo, che inizia con https://'),
    }),
  ],
  preview: { prepare: () => ({ title: 'Contatti' }) },
})

export const privacy = defineType({
  name: 'privacy',
  title: 'Privacy',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({
      name: 'titolo',
      title: 'Titolo',
      type: 'string',
      initialValue: 'Informativa privacy',
    }),
    defineField({
      name: 'testo',
      title: 'Testo dell’informativa',
      type: 'testoStrutturato',
      description:
        'Il testo dell’informativa. Usa "Titolo di sezione" per i titoli numerati e l’elenco puntato per le liste.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Privacy' }) },
})

export const impostazioni = defineType({
  name: 'impostazioni',
  title: 'Impostazioni del sito',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'nomeSito',
      title: 'Nome del sito',
      type: 'string',
      description:
        'Compare nella scheda del browser e nei risultati di Google. Esempio: "Irene Neri, fotografa".',
      validation: (r) => [r.required().error('Scrivi il nome del sito.'), r.max(60)],
    }),
    defineField({
      name: 'descrizione',
      title: 'Descrizione per i motori di ricerca',
      type: 'text',
      rows: 2,
      description: 'Una o due frasi che Google può mostrare sotto il nome del sito.',
      validation: (r) => r.max(160).warning('Google ne mostra circa 160 caratteri.'),
    }),
    defineField({
      name: 'immagineCondivisione',
      title: 'Immagine per la condivisione',
      type: 'immagineConAlt',
      description:
        'La foto che compare quando qualcuno condivide il sito su WhatsApp o sui social. Meglio orizzontale.',
    }),
    defineField({
      name: 'testoPiede',
      title: 'Testo in fondo alle pagine',
      type: 'string',
      description: 'Esempio: "Irene Neri, fotografa".',
      validation: (r) => r.max(120),
    }),
  ],
  preview: { prepare: () => ({ title: 'Impostazioni del sito' }) },
})
