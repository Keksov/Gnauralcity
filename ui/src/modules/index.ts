import { assembleModules, type CoreModuleDescriptor } from '@hostkit/app/module-registry'
import { gnauralModule } from '@gnauralcore/ui/module'

// The modules of this host, in order (GCY-D17): GnauralCore alone.
export const registeredModules: readonly CoreModuleDescriptor[] = [gnauralModule]

const assembled = assembleModules(registeredModules)

export const moduleRoutes = assembled.routes
export const modulePanels = assembled.panels
