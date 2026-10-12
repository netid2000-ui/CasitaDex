# CasitaDex — Backup Phase A checkpoint
Date: October 11, 2026 Pacific. Source: 789bda3a79b8f712f735eb0d14c918ca81c99b2c.
Repository: C:\CasitaDex-Git; branch prototype/bootstrap.
Reviewed Charter v0.3, status, roadmap, ADR-002, continuation/execution requirements,
backup acceptance, runbook, QA and security reviews.

## Verified
- Primary AI Commander connection works; Windows agent 1.4.3.
- 41/41 tests, TypeScript, lint PASS. Node 24.19.0/npm 11.17.0.
- Existing build checkout E:\cdx\a at 789bda3; tracked app source matches HEAD.
- APK: E:\cdx\a\android\app\build\outputs\apk\release\app-release.apk.
  Package com.designsbyfa.casitadex.staging, arm64-v8a, version 0.1.0/code 1.
  APK SHA256: 66F2390117B512FB400C6D1B473AC8D7C508EF3D7E831843646B7B66A44768BB.
- Valid signature; certificate SHA256:
  fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c.
  Matches earlier C:\cdy\a APK; installed-phone certificate is NOT checked.
- Bundled JS: 2,324,192 bytes; backup success text/picker option present.
- Retained release graph successful, no Firebase/unresolved markers.
  Manifest inspection exit 0; no firebase/MESSAGING_EVENT matches.
- Existing backup and safety copy both validate with current parseData/exportData:
  E:\CasitaDex-Backups\CasitaDex-backup-2026-10-10T00-13-29-216Z.json
  E:\CasitaDex-Recovery-Safety\CasitaDex-backup-2026-10-10T00-13-29-216Z.json
  Both: 528 bytes, schema 1, one Space, two cards, no media; round-trip PASS.
  SHA256: 2272c7b85ffb8079e7e8ba56f2abe76d9fdf998626b6463cf950d0f6c7312ec7.
  Contents unchanged, not printed/committed. Same-drive copies are not off-device backup.
- adb devices -l: no target. No rebuild or phone operation performed.

## Remaining gate
Physical native restore/device-replacement recovery: OPEN. Saved-file validation does
not prove exporting device or native restore. Prior Oct 9 offline/reboot PASS retained.
TalkBack/iOS/VoiceOver/media/reminders remain OPEN. Dependency remediation/Doctor historical
OPEN, not rerun. Desktop tests do not waive these gates or complete media-inclusive CD-SB-05.

## Next
Connect/unlock Samsung by USB; authorize debugging. Inspect installed identity/signer;
compare before any install -r. Never uninstall or clear storage to fix mismatch.
Establish backup freshness, preserve copies, then test import preview and cancel first.
Actual replacement restore requires disposable test data/device or reviewed protected
recovery arrangement; do not overwrite household records for acceptance.
Record device/APK, before/after, cold-reopen and offline evidence.
Return to current CasitaDex command-center chat. No new major feature batch.

No app source, dependencies, accounts, ports, paid services, Firebase, Production,
cloud builds, store activity, remote push, household records or existing backups changed.
