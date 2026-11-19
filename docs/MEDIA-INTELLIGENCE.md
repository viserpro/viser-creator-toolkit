# Media Intelligence · 0.3.0

## Requirements

- Node.js 22.6 or newer.
- FFmpeg/FFprobe installed and available on PATH, or set `FFPROBE_PATH` to the full executable path.
- On this Windows workstation, the scanner also checks `C:\\ffmpeg\\bin\\ffprobe.exe`.

## Scan a media folder

```powershell
npm.cmd run media:scan -- --input "D:\\VISER\\Footage" --output out/media-inventory.json
```

Optional exact duplicate detection:

```powershell
npm.cmd run media:scan -- --input "D:\\VISER\\Footage" --output out/media-inventory.json --hash
```

Optional file cap:

```powershell
npm.cmd run media:scan -- --input "D:\\VISER\\Footage" --max-files 20000
```

The scanner walks nested folders, skips symbolic links and common dependency/build directories, recognizes common video/audio/image extensions, and probes video/audio/image metadata. Probe concurrency is limited to three files. The default file limit is 10,000.

## Metadata

Each asset can include:
- Relative path, file name, extension, kind, file size, modified timestamp.
- Probe status and per-file issues.
- Duration, container/format name, bit rate.
- Video codec, width, height, frame rate, and rotation.
- Audio codec, sample rate, channel count, and audio/video stream presence.
- SHA-256 digest when `--hash` is enabled.

The report includes schema version, generation time, input root, FFprobe version, scanned/probed/failed counts, total bytes, asset records, and warnings.

## Import and rough cut

1. Open VISER Creator Workspace.
2. Under **Media Intelligence**, import `media-inventory.json`.
3. Review the asset list and probe failures.
4. Click **Buat rough cut**.
5. Valid video files are sequenced in inventory order on the main video track. Valid audio files are placed at time zero on the audio track. Images remain in the media bin until manually added to the overlay track.
6. Select a timeline clip to move it by one second, split it at its midpoint, trim 0.25 seconds from either source edge, or remove it.
7. Export `viser-timeline.json`.

## Safety and privacy

- FFprobe reads the selected media files; VISER does not upload footage to a server.
- The inventory JSON contains the absolute root folder path. Review or redact it before sharing the report.
- The report may contain file names and relative folder names. Do not publish it if those are private.
- SHA-256 hashing reads every byte of each file. For large 4K libraries this can be I/O-intensive, so it is opt-in.
- Original source media is never modified by the scanner or timeline model.
- Generated reports should be stored under `out/`, which is git-ignored.

## Limitations

- The scanner is a Node CLI, not a browser directory scanner. The browser imports its report JSON.
- The rough cut is a timeline manifest only. It does not render a video or create a CapCut project.
- Audio placement is intentionally conservative: every imported audio clip starts at zero. Arrange voiceover and music manually.
- Clip move controls shift by one second. Split is at the selected clip midpoint. Trim controls adjust source in/out by 0.25 seconds.
- No thumbnail, waveform, proxy, face tracking, silence detection, or audio-to-subtitle alignment is produced yet.
- Image duration is not defined in the source file; images are assigned a five-second placeholder duration only when manually added to a timeline.

## Troubleshooting

- **FFprobe not found:** install FFmpeg and add its `bin` folder to PATH, or set `FFPROBE_PATH`.
- **File failed probing:** test the file with `ffprobe -v error "path-to-file"`. It may be corrupt, incomplete, encrypted, or unsupported by the installed build.
- **Too many files:** narrow the selected root or raise `--max-files`.
- **Duplicate detection is slow:** omit `--hash` for a metadata-only scan.
- **Timeline JSON is not a render:** use it as a portable editing manifest; render integration is planned for a later milestone.
