# Online Teleprompter

Read a script at a controlled pace with adjustable typography, mirroring, focus mode, fullscreen presentation, and keyboard controls.

This is a complete standalone browser application. It does not require eBURP,
an account, a server-side API, or a private runtime.

## Features

- Editable scripts with session recovery and download
- Adjustable speed, font size, line height, width, and alignment
- Countdown, play, pause, restart, and progress controls
- Mirroring, reading guide, focus mode, and fullscreen
- Keyboard-operated presentation controls

## Screenshot

![Online Teleprompter interface](./public/tool-preview.webp)

## Browser support and limitations

The current stable releases of Chromium, Firefox, and Safari are supported.
Some browser capabilities vary by platform. Camera and microphone access
requires HTTPS or localhost, clipboard access may require a user gesture, and
fullscreen or output-device selection may not be available in every browser.
The tool remains usable where a non-essential capability is unavailable.

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
Vercel static hosting, or an ordinary file upload. No provider-specific
runtime, account integration, or server-side function is required by the
application.

## Data and network behaviour

The upstream application ships without analytics or telemetry. Tool processing
occurs in the browser, and the primary browser tests fail unexpected external
requests. See [PRIVACY.md](./PRIVACY.md) for the repository-specific storage
and browser API inventory.

## Contributing

Issues and pull requests are welcome. Read
[CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a change.

## Licence

Original code is available under the [MIT Licence](./LICENSE). Dependencies and
assets retain their own licences; see
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

Originally developed for [eBURP](https://eburp.com/). The eBURP name and logo
are not licensed under the MIT Licence.
