import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons/Tag'

export const categoria = defineType({
  name: 'categoria',
  title: 'Categoria',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'titolo',
      title: 'Nome',
      type: 'string',
      description: 'Esempio: "Sport", "Persone", "Animali", "Eventi".',
      validation: (r) => [r.required().error('Dai un nome alla categoria.'), r.max(30)],
    }),
    defineField({
      name: 'slug',
      title: 'Indirizzo',
      type: 'slug',
      description: 'Premi "Genera" per crearlo dal nome.',
      options: { source: 'titolo', maxLength: 40 },
      validation: (r) => r.required().error('Premi "Genera" per creare l’indirizzo dal nome.'),
    }),
    defineField({
      name: 'descrizione',
      title: 'Descrizione breve (facoltativa)',
      type: 'string',
      description: 'Una riga che spiega la categoria. Esempio: "Gare, allenamenti e spettacoli".',
      validation: (r) => r.max(120).warning('Basta una riga, sotto i 120 caratteri.'),
    }),
    defineField({
      name: 'ordine',
      title: 'Posizione nel filtro',
      type: 'number',
      description: 'Le categorie compaiono nel filtro in ordine crescente: 1 è la prima.',
      initialValue: 10,
      validation: (r) => r.integer().min(0).error('Scrivi un numero intero, per esempio 1, 2, 3.'),
    }),
  ],
  orderings: [{ title: 'Posizione', name: 'ordine', by: [{ field: 'ordine', direction: 'asc' }] }],
  preview: { select: { title: 'titolo', subtitle: 'descrizione' } },
})
