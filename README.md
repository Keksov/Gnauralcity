# Gnauralcity

The minimal product on the GnauralCore audio component (plan `gnauralcity`, decisions GCY-D13, GCY-D17 in
`MindWaveCore/docs/gnauralcity/gnauralcity-plan.md`): its main window is the Audio page alone. A host of
the KKMindWave workspace — it is configuration over the shared kit, not code of its own:

- `ui/` — the HostKitCore host UI factory (`ui/quasar.config.ts`: `hostUi` + `hostQuasarConfig`) with one
  module, `GnauralCore/ui`; the shell's bare layout (no header) and the route `#/audio` (`#/` leads there);
  key prefix `gnauralcity-`. The root component and the pinia store come from the factory.
- `server/` — the HostKitCore server skeleton on port 3310 (`server/server.ts`) with one module,
  GnauralCore's server module (`createGnauralServerModule`, since GCY3.8): playback, the spectrogram,
  projects, the edit journal, saving, the file browser, `/api/ui-diag`. User-data root (projects,
  `documents/noname.gnaural`, the audio and spectrogram cache): `%LOCALAPPDATA%\Gnauralcity` (registry
  `hosts.json` at the workspace root); the component's settings: `server/var/gnaural-settings.json`;
  diagnostics logs (`ui-diag.log`, `fs-browser.log`, `undo-log-perf.log`): `server/var/`.
  Environment (all unset in normal use): `HK_RUNTIME_DIR` — another runtime folder (the settings file
  goes there; the diagnostics logs stay in `server/var`), `HK_WRITE_FENCE` — a sandbox write fence,
  `HK_DEV=1` — DEV mode (`bun run dev` sets it). The spectrum worker is found by GnauralCore's resolver:
  `SPECTRUMCORE_WORKER_EXE`, else `server/vendor/spectrumcore/`, else the neighbouring
  `SpectrumCore/build` (this host has no `vendor/` copy yet — bundling into every host is step GCY5.3).
- `server/app.cfg`, `AppCore.ini`, `AppCore.ico` — AppCore WebView2 launch: ports 3310 (server) and
  9010 (quasar dev), window title "Gnauralcity", a draft icon.

Install and launch, from the workspace root (the bootstrap does the first two for every host):

    HostKitCore\scripts\init-host.bat Gnauralcity\server
    powershell -File HostKitCore\scripts\sync-appcore-launcher.ps1 -ServerDir Gnauralcity\server
    Gnauralcity\server\AppMain.exe

Checks (verify): `bun run typecheck` and `bun run build` in `ui/` (steps `gnauralcity-ui-*` in
`MindWaveCore/uitest/src/verify-steps.ts`); the server code is type-checked in `MindWaveCore/server`'s
program. What does not work in Gnauralcity yet is listed in the evidence of step GCY2.1 and updated by
later steps (`MindWaveCore/docs/gnauralcity/gnauralcity-progress.json`); the list only shrinks.
