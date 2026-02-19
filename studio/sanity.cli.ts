import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'e3cginxl',
    dataset: 'production'
  },
  deployment: {
    appId: 'kd8dtcpr763hv2f6fbjhy2uz',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
