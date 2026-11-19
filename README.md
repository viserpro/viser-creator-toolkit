# VISER Creator Toolkit

[![CI](https://github.com/viserpro/viser-creator-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/viserpro/viser-creator-toolkit/actions/workflows/ci.yml)

**From script to video.** A modular toolkit for repeatable short-form video production, built around Remotion and a creator-defined style guide.

## Current capabilities

- Reusable 1080 × 1920 transparent Remotion overlay rendered as ProRes 4444 MOV.
- Typed creator guidebook covering brand, format, pacing, hook, subtitles, motion, colors, audio, story beats, avoid-list, references, and tools.
- Script compiler: one non-empty line becomes one scene, with frame timing, story-beat labels, subtitle wrapping, approximate word cues, motion presets, and warnings.
- Asset manifest preflight for duplicate paths, file size, media extension, duration, and expected audio/video stream metadata.
- Audio mix planner for voice priority, music level, fade timing, SFX policy, and warnings.
- Example guidebook and sample script.
- Automated tests for core logic.

## Quick start

Requirements: Node.js 22.6+ and npm. Remotion's own license and eligibility rules still apply.

```powershell
npm.cmd install
npm.cmd run dev
```

Run checks:

```powershell
npm.cmd run typecheck
npm.cmd test
```

Render the transparent overlay:

```powershell
npm.cmd run render:overlay
```

Output: `out/viser-overlay-demo.mov`. Verify codec and alpha with FFprobe before compositing.

## Compile a script

Import `defaultGuide` and `compileScript` from `src/core`. Provide a guidebook and script where each line represents one visual scene. The default scene duration is controlled by `video.maxSceneSeconds` (3 seconds in the example). Word cue timing is estimated by character weight; it is not speech recognition and must be checked against the actual voiceover.

See [docs/WORKFLOW.md](docs/WORKFLOW.md), [examples/guidebook.viser.json](examples/guidebook.viser.json), and [examples/script.txt](examples/script.txt).

## Project principles

1. Keep source media, scripts, voiceovers, fonts, credentials, and rendered outputs out of Git unless redistribution rights are explicit.
2. Preview before full-quality rendering.
3. Preserve source files; write generated files to `out/`.
4. Make workflows reproducible and understandable to non-developer creators.
5. Keep integrations optional and document their separate licenses.

## Licensing

VISER's original code and documentation are licensed under MIT; see [LICENSE](LICENSE). Third-party dependencies retain their own licenses. Remotion is source-available under its own license, not an OSI-approved open-source license. Read [docs/LICENSING.md](docs/LICENSING.md) before use or redistribution.

VISER is not affiliated with or endorsed by Remotion. Third-party reference PDFs used during development are not included or reproduced in this repository.

## Known limitations

This release does not automate CapCut timeline insertion, transcript-to-audio alignment, voice activity detection, face-aware safe-area detection, automatic crop tracking, or final export. Asset preflight validates supplied metadata and does not probe files itself. The audio planner produces a plan; it does not process audio.

## Status

Early public development. See [CHANGELOG.md](CHANGELOG.md) and [docs/ROADMAP.md](docs/ROADMAP.md).
