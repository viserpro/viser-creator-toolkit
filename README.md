# VISER Creator Toolkit

[![CI](https://github.com/viserpro/viser-creator-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/viserpro/viser-creator-toolkit/actions/workflows/ci.yml)

**From script to video.** A small, reusable toolkit for independent creators who want repeatable short-form video workflows.

VISER is being developed in public. The first release focuses on a reusable vertical motion-graphics overlay built with Remotion. Script parsing, asset validation, and additional render workflows will be added only after they are documented and tested.

## What works in this starter

- A reusable 1080 × 1920, 30 fps overlay composition.
- Editable title, kicker, and supporting text through composition props.
- Transparent-background rendering to a ProRes 4444 MOV (when the local FFmpeg build supports the requested pixel format).
- A separate local preview workflow for your own footage can be added without publishing that footage.

## Quick start

Requirements: Node.js 20.19+ (or a supported newer LTS/current release), npm, and a compatible FFmpeg build.

```powershell
npm install
npm run dev
```

Render the demo overlay:

```powershell
npm run render:overlay
```

The output is written to `out/viser-overlay-demo.mov`. Check the codec and alpha channel with `ffprobe` before compositing.

## Project principles

1. Keep source media, scripts, voiceovers, fonts, credentials, and rendered outputs out of Git unless the owner has explicit redistribution rights.
2. Preview before full-quality rendering.
3. Preserve source files; write generated files to `out/`.
4. Make workflows reproducible and understandable to non-developer creators.
5. Keep integrations optional and document their separate licenses.

## Licensing

VISER's original code and documentation are licensed under MIT; see [LICENSE](LICENSE). Third-party dependencies retain their own licenses. In particular, Remotion is source-available under its own license, not an OSI-approved open-source license. Read [docs/LICENSING.md](docs/LICENSING.md) before using or redistributing a workflow based on it.

VISER is not affiliated with or endorsed by Remotion.

## Status

This is an early public-development scaffold, not a complete script-to-video product. See [CHANGELOG.md](CHANGELOG.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

## Contributing

Bug reports, reproducible examples, documentation fixes, and small focused pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first.
