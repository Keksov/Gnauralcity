import type { RouteRecordRaw } from 'vue-router'
import { hostRouter, moduleRouteRecords } from '@hostkit/app/host-router'
import { panelHostRoute } from '@hostkit/app/panel-host-route'
import { moduleRoutes, modulePanels } from '../modules'

// The main window is the Audio page alone, in the shell's bare layout (no header, no tabs — GCY-D6,
// GCY-D21). Its address stays `#/audio` (uitest's addresses work as they are); `#/` leads there.
const routes: RouteRecordRaw[] = [
  panelHostRoute(modulePanels),
  {
    path: '/',
    component: () => import('@hostkit/shell/ShellLayout.vue'),
    children: [
      { path: '', redirect: '/audio' },
      ...moduleRouteRecords(moduleRoutes),
    ],
  },
]

export default hostRouter(routes)
