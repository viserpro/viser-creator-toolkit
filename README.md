# VISER Creator Toolkit

[![CI](https://github.com/viserpro/viser-creator-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/viserpro/viser-creator-toolkit/actions/workflows/ci.yml)

A local-first short-form video production workspace. VISER turns scripts and creator guidebooks into scene plans, inventories real media with FFprobe, and prepares editable multi-track rough cuts before final finishing in CapCut.

## Current capabilities · 0.3.0

- Creator Workspace for script editing, guidebook import, scene compilation, storyboard review, and JSON/SRT export.
- FFprobe media scanner for video, audio, and image folders, including duration, codec, resolution, FPS, audio streams, sample rate, channels, file size, and probe failures.
- Optional SHA-256 duplicate-content detection.
- Media inventory JSON report that can be imported into the workspace.
- OpenCut-inspired media bin and multi-track timeline concepts: separate video, overlay, and audio tracks; non-destructive source trims; clip move, split, and remove; rough-cut assembly.
- Typed guidebook validation, subtitle wrapping, approximate word cues, story-beat labels, motion presets, and warnings.
- Audio mix planning and transparent Remotion ProRes 4444 overlay rendering.

## Quick start

Requirements: Node.js 22.6+, npm, and FFmpeg/FFprobe. Remotion's own license and eligibility rules apply.

Install dependencies and start the browser workspace:

```powershell
npm.cmd install
npm.cmd run dev:app
```

Open `http://127.0.0.1:4173`.

Start Remotion Studio separately:

```powershell
npm.cmd run dev
```

## Media Intelligence workflow

1. Scan your source footage folder with FFprobe:

```powershell
npm.cmd run media:scan -- --input "D:\\VISER\\Footage" --output out/media-inventory.json
```

2. Optional exact duplicate detection (reads every file to calculate SHA-256):

```powershell
npm.cmd run media:scan -- --input "D:\\VISER\\Footage" --output out/media-inventory.json --hash
```

3. In VISER, open **Media Intelligence → Impor laporan JSON**.
4. Review file metadata and failed probes.
5. Click **Buat rough cut** to arrange valid videos sequentially and put audio assets on a separate audio track.
6. Select a clip to move it, split it, trim its source in/out, or remove it.
7. Export `viser-timeline.json` as the editable timeline manifest.

See [docs/MEDIA-INTELLIGENCE.md](docs/MEDIA-INTELLIGENCE.md) for scanner details, schema, limitations, and troubleshooting.

## Timeline design

The timeline model uses separate video, overlay, and audio tracks. Clip timing is non-destructive: source media is not modified; clip start and source in/out points are stored in JSON. The current rough-cut generator sequences video assets in the order returned by the inventory and starts imported audio at timeline zero. Review and arrange audio manually before rendering.

## Checks and render

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build:app
npm.cmd run render:overlay
```

Transparent overlay output: `out/viser-overlay-demo.mov`. Verify codec and alpha with FFprobe before compositing.

## Project principles

1. Keep source media, scripts, voiceovers, credentials, and rendered outputs out of Git unless redistribution rights are explicit.
2. Media scanning and editing metadata are local-first; VISER does not upload the user's footage.
3. Preview before full-quality rendering.
4. Preserve source files; write generated files to `out/`.
5. Make automation reproducible and keep final export decisions with the creator.

## OpenCut reference and licensing

VISER selectively adopts ideas from the archived OpenCut Classic workflow, such as a media bin, typed multi-track clips, source trim points, and split/move operations. This is an independent VISER implementation; the OpenCut application, monorepo, Rust/WASM engine, database, authentication, and cloud services are not bundled into VISER. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

VISER's original code and documentation are licensed under MIT; see [LICENSE](LICENSE). Third-party dependencies retain their own licenses. Remotion is source-available under its own license, not an OSI-approved open-source license. Read [docs/LICENSING.md](docs/LICENSING.md) before use or redistribution.

## Known limitations

- Media inventory scanning is a local Node/FFprobe CLI. The browser UI imports its JSON report; it does not directly access arbitrary disk folders.
- SHA-256 duplicate detection is opt-in because it reads every byte of each media file and can take time on large footage libraries.
- Rough cut is an editable timeline manifest, not a final rendered video and not a CapCut draft.
- Video clips are initially placed sequentially; audio clips start at timeline zero and require manual arrangement.
- Timeline controls are basic move-by-one-second, split-at-midpoint, trim-by-0.25-second, and remove operations. Drag-and-drop, ripple editing, undo/redo, waveform rendering, thumbnail extraction, and playback are not implemented yet.
- The workspace preview is a scene-layout preview, not a source-footage player.
- Word cues and SRT timing are estimates, not speech recognition or voiceover alignment.
- Face-aware reframing, proxy generation, automatic subtitle alignment, and CapCut timeline insertion remain future work.

See [CHANGELOG.md](CHANGELOG.md) and [docs/ROADMAP.md](docs/ROADMAP.md).
