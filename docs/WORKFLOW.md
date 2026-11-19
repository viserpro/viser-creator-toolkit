# VISER creator workflow

## 1. Define a style guide
Copy `examples/guidebook.viser.json` into your private working project and edit it. It models brand identity, technical format, pacing, opening hook, subtitles, motion graphics, colors, audio, story beats, avoid-list, creator references, and tools.

Keep personal account data, licensed fonts, footage, music, and voiceovers out of the public repository.

## 2. Write the script
Use one visual idea per line. The compiler treats each non-empty line as one scene and applies a default duration of three seconds (or the guidebook's `maxSceneSeconds`). This is an estimate, not automatic speech recognition or measured voiceover sync.

## 3. Compile a scene plan
Import `compileScript` from `src/core/compiler.ts`. It returns a versioned JSON-ready project with frame ranges, beat labels, subtitle line wrapping, approximate word cues, motion presets, and warnings.

## 4. Validate media
Build an asset manifest from your media probe or asset manager, then call `inspectAssetManifest`. It checks duplicate paths, recognized extensions, empty files, invalid durations, and expected stream metadata. It does not read media files or replace FFprobe.

## 5. Plan audio
Use `createAudioMixPlan` to turn voice/music/SFX preferences into a consistent mix plan. It does not modify or normalize audio files.

## 6. Render and review
The existing Remotion command renders ProRes 4444 with alpha. Inspect output in a player that supports alpha and verify the stream with FFprobe before importing into CapCut. Render a short preview first, inspect text safe areas, subtitle overlap, clipping, and alpha, then proceed to full quality.

## Safety rules
- Back up a CapCut project before any direct project-file editing.
- Close CapCut before any external tool writes to its draft project. Reopen only after the write is complete.
- Prefer generated overlay files over direct mutation of CapCut project internals.
- Never overwrite source footage. Generated files belong in `out/`.
- Never commit private footage, transcripts, voiceovers, draft projects, credentials, or purchased reference documents.

## Current limits
The toolkit does not yet automate CapCut timeline insertion, voice activity detection, transcript alignment, facial-safe-area detection, automatic crop tracking, or final export. Those need dedicated integrations and validation against real projects.
