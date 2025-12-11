import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'
import {myStructure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'epitomeplus',

  projectId: 'e3cginxl',
  dataset: 'production',

plugins: [
    structureTool({
      structure: myStructure,
    }),
    visionTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
})
