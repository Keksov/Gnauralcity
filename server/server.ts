// Gnauralcity's server — the minimal host of the GnauralCore audio component (plan gnauralcity,
// GCY-D13): HostKitCore's server skeleton (GCY-D29) with this host's port and folders. No module yet:
// GnauralCore's server module (audio, projects, journal, file browser) is mounted here by GCY3.x; until
// then the skeleton serves the built UI, the "Bun actions" admin endpoints and the /ws/ui channel.

import { join, resolve } from "node:path"

import { ensureLoopbackNoProxy } from "../../HostKitCore/server/loopback"
import { resolveServerPort } from "../../HostKitCore/server/port"
import { startHostServer } from "../../HostKitCore/server/start"

ensureLoopbackNoProxy()

/** The backend port when neither --port=N nor PORT is given — app.cfg ServerPort, the UI's dev proxy. */
const DEFAULT_SERVER_PORT = 3310

const hostDir = import.meta.dir

const { server } = startHostServer({
  port: resolveServerPort(DEFAULT_SERVER_PORT),
  // 0: no idle timeout — a finite one leaves zombie ws sockets (F-0026).
  idleTimeout: 0,
  publicDir: join(hostDir, "public"),
  admin: {
    uiDir: resolve(hostDir, "..", "ui"),
    restart: { cwd: hostDir, entry: "server.ts" },
  },
  modules: [],
})

console.log(`[server] listening on http://localhost:${server.port}`)
