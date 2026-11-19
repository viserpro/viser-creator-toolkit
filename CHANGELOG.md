# Changelog

## 0.3.0 - Media Intelligence and timeline foundation

- Added a local FFprobe scanner for video, audio, and image assets.
- Added media metadata extraction, failed-file reporting, optional SHA-256 duplicate detection, and JSON inventory export.
- Added inventory validation and media summary helpers.
- Added multi-track timeline data model for video, overlay, and audio.
- Added rough-cut creation, non-destructive trim, split, move, add, remove, and timeline validation.
- Added Media Intelligence UI, asset metadata table, rough-cut timeline panel, clip controls, and timeline JSON export.
- Added ten automated tests covering media inventory and timeline operations.
- Documented OpenCut Classic as an architectural reference; no OpenCut application code was copied into VISER.

## 0.2.1 - Creator Workspace

- Added a responsive local-first browser workspace for script editing and guidebook import.
- Connected the UI to the existing guidebook validator and script compiler.
- Added scene storyboard selection, scene preview, project JSON export, and scene-based SRT export.
- Added workspace documentation, Vite build scripts, and CI production-build validation.
- Clarified that preview and subtitle timing are estimates, not source-footage rendering or speech recognition.

## 0.2.0 - Creator workflow foundation

- Added typed creator guidebook model and validation.
- Added script compiler: one non-empty line per scene, frame timing, beat labels, subtitle wrapping, weighted word cues, motion presets, and pacing warnings.
- Added asset manifest preflight for duplicate paths, empty files, unsupported extensions, invalid duration, and expected stream metadata.
- Added audio mix plan from guidebook voice/music/SFX settings.
- Added original VISER guidebook example, sample script, workflow documentation, and automated core tests.

## 0.1.0 - Public starter

- Prepared a clean public starter from the working local VISER Remotion prototype.
- Replaced project-specific copy with editable composition props.
- Excluded creator-owned footage, transcript data, output renders, local workflow scripts, and third-party agent skills.
- Added licensing, architecture, quick-start, roadmap, and contribution documentation.
