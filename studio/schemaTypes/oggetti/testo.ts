import { defineArrayMember, defineType } from 'sanity'

const link = {
  name: 'link',
  type: 'object',
  title: 'Link',
  fields: [
    {
      name: 'href',
      type: 'url',
      title: 'Indirizzo',
      description: 'Esempio: https://www.instagram.com/nomeprofilo oppure mailto:nome@esempio.it',
      validation: (r: import('sanity').UrlRule) =>
        r
          .required()
          .uri({ scheme: ['https', 'http', 'mailto'] })
          .error('Scrivi un indirizzo completo, che inizia con https:// (o mailto: per una email)'),
    },
  ],
}

/** Testo a paragrafi con grassetto, corsivo e link: niente titoli, elenchi o colori. */
export const testoSemplice = defineType({
  name: 'testoSemplice',
  title: 'Testo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Paragrafo', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Grassetto', value: 'strong' },
          { title: 'Corsivo', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'Indirizzo',
                description: 'Esempio: https://www.instagram.com/nomeprofilo',
                validation: (r) =>
                  r
                    .required()
                    .uri({ scheme: ['https', 'http', 'mailto'] })
                    .error('Scrivi un indirizzo completo, che inizia con https://'),
              },
            ],
          },
        ],
      },
    }),
  ],
})

/** Testo lungo con titoli di sezione ed elenchi puntati (per l'informativa privacy). */
export const testoStrutturato = defineType({
  name: 'testoStrutturato',
  title: 'Testo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragrafo', value: 'normal' },
        { title: 'Titolo di sezione', value: 'h2' },
        { title: 'Sottotitolo', value: 'h3' },
      ],
      lists: [{ title: 'Elenco puntato', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Grassetto', value: 'strong' },
          { title: 'Corsivo', value: 'em' },
        ],
        annotations: [link],
      },
    }),
  ],
})
