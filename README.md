# PDF Bookmarks for ONLYOFFICE

[![Version](https://img.shields.io/badge/version-1.0.6-2f73d9)](https://github.com/Chenaters/onlyoffice-pdf-bookmarks/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-2f73d9)](LICENSE)

PDF Bookmarks adds a persistent left-side bookmark panel to the PDF editor in
ONLYOFFICE Desktop Editors 9.4 or later.

> PDF Bookmarks stores private navigation markers locally. It does not modify
> the PDF outline or write data into the PDF file.

## Features

- Add a named bookmark for the currently visible PDF page.
- Jump to a bookmark with one click.
- Rename and delete bookmarks.
- Clear all bookmarks for the current PDF.
- Show the empty-state message only when the current PDF truly has no bookmarks.
- Keep separate bookmark lists for separate local PDF files.
- Save changes immediately and flush them again when the panel, PDF, or app closes.
- Show a crisp bookmark launcher in the left sidebar and on the Plugins ribbon.
- Follow the active ONLYOFFICE light, dark, or contrast-dark theme with
  contrast-checked text, cards, inputs, and buttons.
- Work offline after installation.

Bookmarks are app-local navigation data. They are saved by the plugin on this
computer and are not written into the PDF outline. This keeps the PDF unchanged
and also makes the feature work for read-only PDFs.

## Use

1. Open a PDF in ONLYOFFICE Desktop Editors.
2. Open the **Plugins** tab.
3. Select the visible **PDF Bookmarks** icon. After the panel has been opened,
   its bookmark launcher remains available in the left sidebar for that PDF.
4. Move to a page, optionally change the proposed name, and select
   **Bookmark current page**.
5. Select any saved bookmark to return to its page.

## Build and install

The checked-in plugin has no package dependencies.

```powershell
npm test
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1
```

Restart ONLYOFFICE after installation. The installer copies the plugin to the
per-user directory documented by ONLYOFFICE:

```text
%LOCALAPPDATA%\ONLYOFFICE\DesktopEditors\data\sdkjs-plugins\{D8E1B7A2-6C3F-4A90-9E12-7F4B5C8D0A31}
```

The distributable archive is created at `dist/pdf-bookmarks.plugin` and can
also be installed through **Plugins > Plugin Manager > My plugins > Install
plugin manually**.

## Privacy

The plugin has no accounts, analytics, network requests, or external runtime
dependencies. Bookmark data stays in the editor's local storage. A compact
fingerprint of the first rendered page is used to distinguish same-named PDFs;
the page image itself is not stored.

## Support

- Report a problem or request a feature in
  [GitHub Issues](https://github.com/Chenaters/onlyoffice-pdf-bookmarks/issues).
- See release history in [CHANGELOG.md](pdf-bookmarks/CHANGELOG.md).
- Read the marketplace preparation notes in
  [MARKETPLACE_SUBMISSION.md](MARKETPLACE_SUBMISSION.md).

## How document separation works

ONLYOFFICE can expose a different temporary source path each time the same PDF
is opened. To keep the bookmark key stable, the plugin combines the PDF file
name with a compact fingerprint of its first rendered page. The source path and
page image are not saved in the bookmark data. If page preview access is not
available, the plugin falls back to the stable PDF file name.

## Upstream reference

The official `ONLYOFFICE/sdkjs-plugins` repository is sparse-cloned in
`upstream/sdkjs-plugins`. The implementation uses the current ONLYOFFICE PDF
plugin methods `GetCurrentPage` and `GoToPage`, plus the current `panel`
plugin type. No upstream build is required.

## License

MIT. See [LICENSE](LICENSE).
