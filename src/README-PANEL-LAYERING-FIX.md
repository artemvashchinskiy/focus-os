FocusOS panel layering fix

Changes:
- Opening “How to use Dropbox” no longer closes Navigation; the Navigation panel remains open behind the help panel.
- Danger Zone z-index overrides of 1001 were reduced to 998 so it stays behind Navigation, consistent with other panels.

Verification:
- Source changes were checked against the supplied FocusOS-dropbox-help-panel.zip.
- ZIP integrity was checked after packaging.
- A production build/browser interaction test was not run because this archive does not include package.json/Vite build configuration and installed dependencies.
