# Online Teleprompter

Read a script at a controlled pace with adjustable typography, mirroring, focus mode, fullscreen presentation, and keyboard controls.

[Features](#features) · [Usage](#usage) · [Run locally](#run-locally) · [Contributing](./.github/CONTRIBUTING.md) · [Licence](./LICENSE)

## Features

- Editable scripts with text-file import, session recovery, clearing, and download
- Slow, natural, and fast presets plus precise scroll-speed control
- Adjustable font size, line spacing, text width, and left or centred alignment
- Optional three- or five-second countdown with play, pause, restart, and progress controls
- Horizontal mirroring for reflective teleprompter rigs
- Reading guide, distraction-reduced focus mode, and fullscreen presentation
- Keyboard controls for playback, speed changes, navigation, restart, and fullscreen

## Screenshot

![Online Teleprompter screenshot](./public/tool-preview.webp)

## Usage

1. Type, paste, or import the script, then download a copy if you want a reusable text file.
2. Choose a speed preset and adjust font size, line spacing, text width, alignment, and countdown.
3. Enable mirroring, the reading guide, or focus mode for the presentation setup you need.
4. Start the countdown, then pause, resume, restart, or manually reposition the script.
5. Enter fullscreen when ready and use the displayed keyboard controls during delivery.

## Browser support

Works with current versions of Chrome/Chromium, Firefox, and Safari.

- Fullscreen must be started by a user gesture and may be unavailable inside restricted embedded frames.
- Keyboard shortcuts work while the page has focus; browsers may reserve some system shortcuts.

## Run locally

You’ll need Git, Corepack, and Node.js 22.13.x or 24.x.

```bash
git clone https://github.com/mjibulu/teleprompter.git
cd teleprompter
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

Open the local URL shown in the terminal.

## Checks

```bash
pnpm run check
pnpm run verify
```

## Build

```bash
pnpm run build
```

The production files are created in `dist/` and can be hosted on GitHub Pages, Netlify, Cloudflare Pages, Vercel, or any static host.

## Privacy

The app runs in your browser and does not include analytics, ads, or telemetry.

This tool may store the following tool-specific keys locally: `teleprompter:script:v1`.

This tool uses: Fullscreen API, sessionStorage, Blob downloads. Availability may vary by browser.

## Contributing

Issues and pull requests are welcome. See the [contribution guide](./.github/CONTRIBUTING.md) before submitting changes.

## Credits

Created by Mujeeb for [eBURP](https://eburp.com/).

## Licence

Licensed under the [MIT Licence](./LICENSE). Third-party dependencies keep their respective licences.
