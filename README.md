# Gnauralcity

The minimal product on the GnauralCore audio component (plan `gnauralcity`, decisions GCY-D13, GCY-D17 in
`MindWaveCore/docs/gnauralcity/gnauralcity-plan.md`): its main window is the Audio page alone. A host of
the KKMindWave workspace — it is configuration over the shared kit, not code of its own:

- `ui/` — the HostKitCore host UI factory (`ui/quasar.config.ts`: `hostUi` + `hostQuasarConfig`) with one
  module, `GnauralCore/ui`; the shell's bare layout (no header) and the route `#/audio` (`#/` leads there);
  key prefix `gnauralcity-`. The root component and the pinia store come from the factory.
- `server/` — the HostKitCore server skeleton on port 3310 (`server/server.ts`); no audio module yet
  (GnauralCore's server module arrives with step GCY3.x). User-data root: `%LOCALAPPDATA%\Gnauralcity`
  (registry `hosts.json` at the workspace root).
- `server/app.cfg`, `AppCore.ini`, `AppCore.ico` — AppCore WebView2 launch: ports 3310 (server) and
  9010 (quasar dev), window title "Gnauralcity", a draft icon.

Install and launch, from the workspace root (the bootstrap does the first two for every host):

    HostKitCore\scripts\init-host.bat Gnauralcity\server
    powershell -File HostKitCore\scripts\sync-appcore-launcher.ps1 -ServerDir Gnauralcity\server
    Gnauralcity\server\AppMain.exe

Checks (verify): `bun run typecheck` and `bun run build` in `ui/` (steps `gnauralcity-ui-*` in
`MindWaveCore/uitest/src/verify-steps.ts`); the server code is type-checked in `MindWaveCore/server`'s
program. What does not work in Gnauralcity yet is listed in the evidence of step GCY2.1
(`MindWaveCore/docs/gnauralcity/gnauralcity-progress.json`); the list only shrinks.
