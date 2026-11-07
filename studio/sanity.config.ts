import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { itITLocale } from '@sanity/locale-it-it'
import { schemaTypes } from './schemaTypes'
import { struttura } from './struttura'
import { DATASET, PROJECT_ID, SINGOLI } from './lib/progetto'

const sviluppo = process.env.NODE_ENV === 'development'
const singoli = new Set<string>(SINGOLI)

export default defineConfig({
  name: 'default',
  title: 'Sito di Irene',
  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({ structure: struttura }),
    itITLocale(),
    // Strumento tecnico per interrogare i dati: solo in sviluppo, mai nello Studio pubblicato.
    ...(sviluppo ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
    // I documenti singoli non si creano dal pulsante "Nuovo": esistono già, uno per tipo.
    templates: (modelli) => modelli.filter(({ schemaType }) => !singoli.has(schemaType)),
  },

  document: {
    // Niente "elimina", "duplica" e "annulla pubblicazione" sui documenti singoli.
    actions: (azioni, { schemaType }) =>
      singoli.has(schemaType)
        ? azioni.filter(
            ({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : azioni,
    newDocumentOptions: (voci, { creationContext }) =>
      creationContext.type === 'global' ? voci.filter((v) => !singoli.has(v.templateId)) : voci,
  },

  // Accesso solo con Google (account con verifica in due passaggi). La pagina di scelta resta,
  // così il nome del metodo è sempre visibile. Possono entrare solo i membri invitati nel progetto.
  auth: {
    redirectOnSingle: false,
    providers: (predefiniti) => predefiniti.filter((p) => p.name === 'google'),
  },
})
