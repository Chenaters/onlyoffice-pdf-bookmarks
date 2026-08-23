# ONLYOFFICE Marketplace submission

## Publisher

- Name: Chenaters
- Repository: https://github.com/Chenaters/onlyoffice-pdf-bookmarks
- License: MIT
- Plugin version: 1.0.6
- Minimum ONLYOFFICE version: 9.4.0
- Plugin GUID: `asc.{D8E1B7A2-6C3F-4A90-9E12-7F4B5C8D0A31}`

## Submission files

Copy `pdf-bookmarks/` to:

`onlyoffice.github.io/sdkjs-plugins/content/pdf-bookmarks/`

Add the object in `marketplace/store-config-entry.json` to the array in the
marketplace repository's `store/config.json`.

Use `marketplace/PULL_REQUEST.md` as the pull-request description.

## Verification checklist

- [x] Valid `asc.{UUID}` GUID.
- [x] Semantic version and minimum editor version.
- [x] Publisher and help URL.
- [x] PDF-only editor support.
- [x] Light and dark adaptive editor icons at all required scales.
- [x] Marketplace icon directory and screenshots.
- [x] Plugin-local README, CHANGELOG, and license.
- [x] No API keys, accounts, analytics, or external runtime dependencies.
- [x] Automated tests pass.
- [x] Manual `.plugin` archive builds successfully.
- [ ] Test the custom GitHub Pages marketplace in the web editor.
- [ ] Open the marketplace pull request.

## Marketplace positioning

**Short description:** Save named page markers in PDFs and return to them with one click.

**Important note:** Bookmarks are stored locally and are not embedded into the
PDF outline. The original PDF is never modified.
