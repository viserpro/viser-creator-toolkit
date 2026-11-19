# Quick start

## 1. Install

Install a supported Node.js version and npm, then clone or download the repository.

```powershell
npm install
```

## 2. Preview the composition

```powershell
npm run dev
```

Open the local Remotion Studio URL shown in the terminal and select `VISER-Overlay-Demo`.

## 3. Render a transparent overlay

```powershell
npm run render:overlay
```

The default output is `out/viser-overlay-demo.mov`.

## 4. Verify transparency

Use ffprobe from your own FFmpeg installation:

```powershell
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,width,height,r_frame_rate,pix_fmt -of json out/viser-overlay-demo.mov
```

The expected output is a ProRes 4444 stream with an alpha-capable pixel format such as `yuva444p10le`. Do not assume a MOV file is transparent without checking it.

## 5. Use in an editor

Import the MOV as an overlay on a separate track. Keep your source footage unchanged. Preview the composite and check safe areas, text readability, and timing before exporting a final video.
