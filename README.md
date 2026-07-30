# Online Teleprompter

Read a script at a controlled pace with adjustable typography, mirroring, focus mode, fullscreen presentation, and keyboard controls.

## Features

- Editable scripts with text-file import, session recovery, clearing, and download
- Slow, natural, and fast presets plus precise scroll-speed control
- Adjustable font size, line spacing, text width, and left or centred alignment
- Optional three- or five-second countdown with play, pause, restart, and progress controls
- Horizontal mirroring for reflective teleprompter rigs
- Reading guide, distraction-reduced focus mode, and fullscreen presentation
- Keyboard controls for playback, speed changes, navigation, restart, and fullscreen

## Screenshot

![Online Teleprompter interface](./public/tool-preview.webp)

## How to use

1. Type, paste, or import the script, then download a copy if you want a reusable text file.
2. Choose a speed preset and adjust font size, line spacing, text width, alignment, and countdown.
3. Enable mirroring, the reading guide, or focus mode for the presentation setup you need.
4. Start the countdown, then pause, resume, restart, or manually reposition the script.
5. Enter fullscreen when ready and use the displayed keyboard controls during delivery.

## Browser support and limitations

The current stable releases of Chromium, Firefox, and Safari are supported.

- Fullscreen must be started by a user gesture and may be unavailable inside restricted embedded frames.
- Keyboard shortcuts work while the page has focus; browsers may reserve some system shortcuts.

## Run locally

Requirements:

- Node.js 24.x
- Corepack

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

## Verify

Fast checks:

```bash
pnpm run check
```

Complete browser verification:

```bash
pnpm run verify
```

## Build and host

```bash
pnpm run build
```

Upload the contents of `dist/` to a static host. The application supports both
root and subdirectory hosting and needs no environment variables.

The same output can be deployed with GitHub Pages, Netlify, Cloudflare Pages,
Vercel static hosting, or an ordinary file upload.

## Data and network behaviour

The application ships without analytics or telemetry. Tool processing occurs
in the browser, and the primary browser tests fail unexpected external
requests. See [PRIVACY.md](./PRIVACY.md) for the storage and browser API
inventory.

## Contributing

Issues and pull requests are welcome. Read
[CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a change.

## Credits

Created by M. Jibulu for [eBURP](https://eburp.com/).

## Licence

Original code is available under the [MIT Licence](./LICENSE). Dependencies and
assets retain their own licences; see
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
