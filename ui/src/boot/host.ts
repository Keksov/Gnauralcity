import { boot } from 'quasar/wrappers'
import { assembleAppMessages } from '@hostkit/app/app-messages'
import { configureHostKeys, hostKey } from '@hostkit/app/host-keys'
import { installHostI18n } from '@hostkit/app/host-i18n'
import { openBunActionsDialog } from '@hostkit/shell/bun-actions'
import { selectAppLocale, type AppLocaleRef } from '@hostkit/shell/language'
import { wsService } from '@hostkit/ws/ws'
import { createGnauralPlugin, type MenuNode } from '@gnauralcore/ui/plugin'
import { registeredModules } from '../modules'
import en from '../i18n/locales/en.json'
import ru from '../i18n/locales/ru.json'

/**
 * The window has no header (GCY-D21), so the shell services MindWave keeps there — the language choice
 * and «Bun actions» — reach the owner as items of the Audio page's menu, through the module's
 * extension form «menu items» (GCY-D18). Labels are the shell's own i18n keys; ids live in the host's
 * `host.*` namespace; every leaf is `noMru` — service items stay out of the recent-commands list.
 */
function hostMenuItems(locale: AppLocaleRef): readonly MenuNode[] {
  return [
    {
      id: 'host.language',
      labelKey: 'language.label',
      icon: 'translate',
      children: [
        { id: 'host.language.en', labelKey: 'language.en', run: () => { selectAppLocale(locale, 'en') }, noMru: true },
        { id: 'host.language.ru', labelKey: 'language.ru', run: () => { selectAppLocale(locale, 'ru') }, noMru: true },
      ],
    },
    { id: 'host.bunActions', labelKey: 'common.bunActionsTitle', icon: 'build', run: openBunActionsDialog, noMru: true },
  ]
}

// The host's one boot file, in the order the shell needs: the key prefix of every name the shell and
// the panel framework write (GCY-D22) — before anything names a key; vue-i18n with the host's, the
// shell's and the module's messages (the saved language under 'gnauralcity-locale'); then the module's
// plugin on the shell's ws transport, with the shell's naming function (the module's view keys go under
// the same prefix — 'gnauralcity-…', GCY4.3) and the host's menu items.
export default boot(({ app }) => {
  configureHostKeys({ keyPrefix: 'gnauralcity-' })
  const i18n = installHostI18n(app, assembleAppMessages({ en, ru }, registeredModules))
  app.use(createGnauralPlugin({ ws: wsService, hostKey, menuItems: hostMenuItems(i18n.locale) }))
})
