# FocusOS source update notes

## Changes made
- Goal cards now use Matrix-style controls: complete checkbox, move up/down, edit, delete.
- Goal completion state is stored with the existing localStorage-backed goal data.
- Goal ordering moves only within the same period and period key.
- Dropbox OAuth redirect URI now uses `window.location.origin`, avoiding a stale `VITE_DROPBOX_REDIRECT_URI` value pointing at localhost. The Dropbox app console must allow the exact deployed origin (`https://myfocusos.vercel.app`).
- Corrected existing TypeScript call signatures in `services/appBackupService.ts` to match the current `getLicense()` and `installLicense(key, now?)` API.

## Cloud backup verification limits
This ZIP was supplied as a source-only folder: it does not include `package.json`, lockfile, `tsconfig.json`, Vite config, environment files, or installed dependencies. Therefore a full production build could not be run from this upload. The live website could not be fetched from this execution environment, so Dropbox/Google OAuth and actual upload/restore operations were not live-tested.

Google Drive specifically requires `VITE_GOOGLE_CLIENT_ID` to be present at Vite build time, and the corresponding Google OAuth client must authorize `https://myfocusos.vercel.app`. This cannot be guaranteed or repaired from source alone without the existing client ID/build configuration. No Vercel settings were changed.
