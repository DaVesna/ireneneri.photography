import { defineArrayMember, defineType } from 'sanity'

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
