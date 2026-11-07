import { defineCliConfig } from 'sanity/cli'
import { PROJECT_ID, DATASET } from './lib/progetto'

export default defineCliConfig({
  api: { projectId: PROJECT_ID, dataset: DATASET },
  server: { port: 3333 },
})
