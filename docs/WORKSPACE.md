# VISER Creator Workspace

## Start
- Run `npm.cmd run dev:app`.
- Open `http://127.0.0.1:4173`.
- Import a plain-text script (.txt or .md) or paste text into the editor.
- One non-empty line becomes one scene.
- Import a valid VISER guidebook JSON to replace the default profile.
- The script, project title, and valid guidebook are auto-saved in browser local storage on that device.

## Export
- JSON exports compiled scene data, frame timing, subtitle wrapping, estimated word cues, story beats, and warnings.
- SRT exports one subtitle cue per scene using fixed scene timing, not voice recognition.

## Boundaries
- Files are read in the browser and are not uploaded to a server.
- Auto-saved drafts are browser/device-specific. Clearing browser storage or switching browsers removes access to that local draft; export project JSON for a portable copy.
- Preview is a layout/sample preview, not a rendered source-footage preview.
- Word cues are estimated and must be checked against the recorded voiceover.
- Media folder ingestion, FFprobe, face tracking, CapCut draft creation, and timeline insertion are not implemented yet.
- Remotion Studio and transparent overlay rendering remain separate commands.
