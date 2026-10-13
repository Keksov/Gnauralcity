// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { HostUiConfig } from '../../HostKitCore/ui/factory/host-ui'
import { hostQuasarConfig } from '../../HostKitCore/ui/factory/quasar-config'

const currentDir = dirname(fileURLToPath(import.meta.url))

// Gnauralcity — the minimal host of the GnauralCore audio component (plan gnauralcity, GCY-D13): its UI
// is HostKitCore's host UI factory with this configuration (GCY-D17). The root component and the pinia
// store come from the factory too; the host's own are the boot file (key prefix, messages, the module's
// plugin) and the routes. tsconfig.hostkit.json is generated from this object:
// `bun ../../HostKitCore/ui/factory/write-host-tsconfig.ts .` after changing aliases or pins here.
export const hostUi: HostUiConfig = {
  uiDir: currentDir,
  hostKitDir: resolve(currentDir, '..', '..', 'HostKitCore'),

  boot: ['host'],

  css: [],

  extras: ['material-icons'],

  distDir: resolve(currentDir, '..', 'server', 'public'),

  // GCY3.1 (GCY-D23): no aliases of its own — the shared protocol's alias went with the cut
  // by owners; GnauralCore imports its own protocol (GnauralCore/ui/protocol) by relative path.
  aliases: {},
  tsPaths: {},

  // GnauralCore's third-party libraries: codemirror — its XML editor.
  modulePins: [
    { name: 'codemirror' },
    { scope: '@codemirror' }
  ],
  chunks: [],

  // The dev proxy's backend when AppCore passes no PORT (server.ts, app.cfg).
  defaultBackendPort: 3310,

  framework: {
    config: {
      dark: true
    },
    iconSet: 'material-icons',
    plugins: ['Notify', 'Dialog']
  }
}

export default hostQuasarConfig(hostUi)
