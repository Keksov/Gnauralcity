// Gnauralcity's server — the minimal host of the GnauralCore audio component (plan gnauralcity,
// GCY-D13): HostKitCore's server skeleton (GCY-D29) with this host's port and folders and ONE module —
// GnauralCore's server module (GCY3.8, GCY-D25): audio, projects, the edit journal, the file browser,
// the spectrogram, their ws messages and `/api/ui-diag`. Nothing of its own besides the configuration:
// no host routes and no ws module without a claim, so an unclaimed ws message is dropped by the skeleton
// (HostKitCore/server/start.ts); the shell's liveness echo is answered by the skeleton itself.

import { join, resolve } from "node:path"

// GCY4.1 (GCY-D14): the component BY NAME, through its declared entry — the `paths` of tsconfig.json next
// to this file map `@gnauralcore/server` to GnauralCore/server/index.ts (Bun reads them at runtime).
import { createGnauralServerModule } from "@gnauralcore/server"
import { ensureLoopbackNoProxy } from "../../HostKitCore/server/loopback"
import { readHostEnv } from "../../HostKitCore/server/host-env"
import { resolveServerPort } from "../../HostKitCore/server/port"
import { startHostServer, UI_WS_TOPIC, type HostServerInstance } from "../../HostKitCore/server/start"

// Same-machine loopback fetches never go through a local HTTP proxy (F-0012); before anything fetches.
ensureLoopbackNoProxy()

/** The backend port when neither --port=N nor PORT is given — app.cfg ServerPort, the UI's dev proxy. */
const DEFAULT_SERVER_PORT = 3310

/** GCY-D27: the user-data root %LOCALAPPDATA%\Gnauralcity (hosts.json `dataRootName`); the cache follows it. */
const USER_DATA_ROOT_NAME = "Gnauralcity"

const hostDir = import.meta.dir

// The host's environment, under the neutral names of GCY-D38 from the start — this host has no MW_*
// legacy to fall back on, so HostKitCore's readHostEnv is called without a fallback (GCY4.4); an empty
// value counts as unset. All of them are unset in normal operation; a sandbox (a probe; uitest, GCY5.1)
// sets them before the process starts.
//   HK_RUNTIME_DIR — the runtime folder (GCY-D26): `var/gnaural-settings.json`, the component's settings
//                    store — the module's own here (GCY-D24: no settings migration in this host).
//                    Default: this folder.
//   HK_WRITE_FENCE — the sandbox write fence: source files and every write into the owner's file space
//                    are confined to this root (GnauralCore/server/write-fence.ts). Default: none.
//   HK_DEV=1       — DEV mode (`bun run dev` sets it): the server half of the journal trail is on
//                    unconditionally (AGENTS.md, «Журнальный след»).
//   HK_IDLE_TIMEOUT_SEC — the HTTP idle timeout, seconds (GCY5.2, as in MindWave's server.ts). Default 0 —
//                    no idle timeout, the fix of F-0026: a FINITE one leaves zombie sockets while a ws is
//                    alive, and an edit's write hangs forever. The knob exists only for a sandbox stand that
//                    reproduces F-0026; the uitest lock T-42 reads this very line from the source
//                    (MindWaveCore/uitest/src/server-idle-setting.ts) to derive its pause — keep its form.
const runtimeDir = readHostEnv("HK_RUNTIME_DIR") ?? hostDir
const writeFenceRoot = readHostEnv("HK_WRITE_FENCE") ?? ""
const IS_DEV = readHostEnv("HK_DEV") === "1"
const SERVER_IDLE_TIMEOUT_SEC = Number(readHostEnv("HK_IDLE_TIMEOUT_SEC") ?? 0)

// The skeleton's Bun server — declared BEFORE the module, whose publish function closes over it;
// assigned by startHostServer below. The module publishes only after the start (session and watcher
// events).
let server: HostServerInstance

// GCY3.8 (GCY-D25): GnauralCore's server module. The diagnostics logs (`ui-diag.log`, `fs-browser.log`,
// `undo-log-perf.log`) go to this host's own `server/var` — a separate parameter, NOT the runtime folder
// (GCY-D26: a sandbox moves the runtime folder, the trail stays where its readers look). No `settings`:
// the module keeps its own store in the runtime folder.
const gnaural = createGnauralServerModule({
  runtimeDir,
  diagnosticsDir: join(hostDir, "var"),
  userDataRootName: USER_DATA_ROOT_NAME,
  writeFenceRoot,
  dev: IS_DEV,
  publish: (aText) => {
    server.publish(UI_WS_TOPIC, aText)
  },
})

server = startHostServer({
  port: resolveServerPort(DEFAULT_SERVER_PORT),
  // 0 by default: no idle timeout — a finite one leaves zombie ws sockets (F-0026); see HK_IDLE_TIMEOUT_SEC above.
  idleTimeout: SERVER_IDLE_TIMEOUT_SEC,
  publicDir: join(hostDir, "public"),
  admin: {
    uiDir: resolve(hostDir, "..", "ui"),
    restart: { cwd: hostDir, entry: "server.ts" },
  },
  // One module; the shutdown chain disposes it (engine, schedule watcher, file-browse server).
  modules: [gnaural],
}).server

console.log(`[server] listening on http://localhost:${server.port}`)
console.log(`[server] file-browse (loopback-only): ${gnaural.fsBrowserUrl}`)

// After the start: the spectrogram cache budget and the spectrum worker's health check, both unawaited.
gnaural.startBackgroundTasks()
