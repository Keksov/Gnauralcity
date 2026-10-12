import { boot } from 'quasar/wrappers'
import { assembleAppMessages } from '@hostkit/app/app-messages'
import { configureHostKeys } from '@hostkit/app/host-keys'
import { installHostI18n } from '@hostkit/app/host-i18n'
import { wsService } from '@hostkit/ws/ws'
import { createGnauralPlugin } from '../../../../GnauralCore/ui/plugin'
import { registeredModules } from '../modules'
import en from '../i18n/locales/en.json'
import ru from '../i18n/locales/ru.json'

// The host's one boot file, in the order the shell needs: the key prefix of every name the shell and
// the panel framework write (GCY-D22) — before anything names a key; vue-i18n with the host's, the
// shell's and the module's messages (the saved language under 'gnauralcity-locale'); then the module's
// plugin on the shell's ws transport.
export default boot(({ app }) => {
  configureHostKeys({ keyPrefix: 'gnauralcity-' })
  installHostI18n(app, assembleAppMessages({ en, ru }, registeredModules))
  app.use(createGnauralPlugin({ ws: wsService }))
})
