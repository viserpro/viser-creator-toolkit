# VISER Creator Toolkit

[![CI](https://github.com/viserpro/viser-creator-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/viserpro/viser-creator-toolkit/actions/workflows/ci.yml)

**From script to video.** A local-first toolkit for repeatable short-form video production, built around Remotion and a creator-defined style guide.

## Current capabilities

- Local Creator Workspace UI for script editing, guidebook import, scene compilation, storyboard review, and JSON/SRT export.
- Responsive 9:16 scene preview and project metrics.
- Typed creator guidebook covering brand, format, pacing, hook, subtitles, motion, colors, audio, story beats, avoid-list, references, and tools.
- Script compiler: one non-empty line becomes one scene, with frame timing, story-beat labels, subtitle wrapping, approximate word cues, motion presets, and warnings.
- Asset manifest preflight for duplicate paths, file size, media extension, duration, and expected audio/video stream metadata.
- Audio mix planner for voice priority, music level, fade timing, SFX policy, and warnings.
- Reusable 1080 × 1920 transparent Remotion overlay rendered as ProRes 4444 MOV.
- Example guidebook, sample script, automated tests, and CI build checks.

## Quick start

Requirements: Node.js 22.6+ and npm. Remotion's own license and eligibility rules still apply.

Start the browser workspace:

```powershell
npm.cmd install
npm.cmd run dev:app
```

Open `http://127.0.0.1:4173`. Files are read locally in the browser; they are not uploaded to a VISER server. The current script, project title, and valid guidebook are auto-saved in that browser's local storage.

Start Remotion Studio separately:

```powershell
npm.cmd run dev
```

Run checks:

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build:app
```

Render the transparent overlay:

```powershell
npm.cmd run render:overlay
```

Output: `out/viser-overlay-demo.mov`. Verify codec and alpha with FFprobe before compositing.

## Compile a script

One non-empty line represents one visual scene. The default maximum scene duration is controlled by `video.maxSceneSeconds` (3 seconds in the example). Word cue timing is estimated by character weight; it is not speech recognition and must be checked against the actual voiceover.

See [docs/WORKSPACE.md](docs/WORKSPACE.md), [docs/WORKFLOW.md](docs/WORKFLOW.md), [examples/guidebook.viser.json](examples/guidebook.viser.json), and [examples/script.txt](examples/script.txt).

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

The workspace preview is a scene-layout preview, not a source-footage render. SRT timing and word cues are estimates based on fixed scene durations, not audio transcription or alignment. The toolkit does not yet automate media folder ingestion, FFprobe inventory, face-aware cropping, CapCut timeline insertion, or final export. Asset preflight validates supplied metadata and does not probe files itself. The audio planner produces a plan; it does not process audio.

## Status

Early public development. See [CHANGELOG.md](CHANGELOG.md) and [docs/ROADMAP.md](docs/ROADMAP.md).
