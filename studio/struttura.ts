import type { StructureResolver } from 'sanity/structure'
import { CogIcon } from '@sanity/icons/Cog'
import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { HomeIcon } from '@sanity/icons/Home'
import { ImagesIcon } from '@sanity/icons/Images'
import { LockIcon } from '@sanity/icons/Lock'
import { TagIcon } from '@sanity/icons/Tag'
import { UserIcon } from '@sanity/icons/User'

// Barra laterale dello Studio: prima le pagine singole, poi album e categorie.
export const struttura: StructureResolver = (S) => {
  const singolo = (tipo: string, titolo: string, icona: typeof HomeIcon) =>
    S.listItem()
      .title(titolo)
      .id(tipo)
      .icon(icona)
      .child(S.document().schemaType(tipo).documentId(tipo).title(titolo))

  return S.list()
    .title('Contenuti')
    .items([
      singolo('home', 'Home', HomeIcon),
      singolo('chiSono', 'Chi sono', UserIcon),
      singolo('contatti', 'Contatti', EnvelopeIcon),
      S.divider(),
      S.listItem()
        .title('Album')
        .id('album')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('album')
            .title('Album, più recenti in alto')
            .defaultOrdering([{ field: 'data', direction: 'desc' }]),
        ),
      S.listItem()
        .title('Categorie')
        .id('categoria')
        .icon(TagIcon)
        .child(
          S.documentTypeList('categoria')
            .title('Categorie')
            .defaultOrdering([{ field: 'ordine', direction: 'asc' }]),
        ),
      S.divider(),
      singolo('privacy', 'Privacy', LockIcon),
      singolo('impostazioni', 'Impostazioni del sito', CogIcon),
    ])
}
