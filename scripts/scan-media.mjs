#!/usr/bin/env node
import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

const execFileAsync = promisify(execFile);
const VIDEO = new Set([".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi", ".mts", ".m2ts", ".3gp", ".mxf", ".ts", ".flv", ".wmv"]);
const AUDIO = new Set([".wav", ".mp3", ".m4a", ".aac", ".flac", ".ogg", ".opus", ".wma", ".aiff", ".aif", ".alac"]);
const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff", ".heic", ".heif"]);
const SKIP = new Set(["node_modules", ".git", ".next", "dist", "build", "cache", "$recycle.bin", "system volume information"]);
const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : fallback; };
const input = arg("--input", null);
const output = arg("--output", "out/media-inventory.json");
const hashEnabled = process.argv.includes("--hash");
const maxFiles = Number(arg("--max-files", "10000"));
if (!input) { console.error('Usage: npm run media:scan -- --input "D:\\Media" [--output out/media-inventory.json] [--hash]'); process.exit(2); }
if (!Number.isInteger(maxFiles) || maxFiles < 1) { console.error("--max-files must be a positive integer."); process.exit(2); }
const root = path.resolve(input), outputPath = path.resolve(output);
const ffprobeCandidates = [process.env.FFPROBE_PATH, "ffprobe", "C:\\ffmpeg\\bin\\ffprobe.exe"].filter(Boolean);
let ffprobe = ffprobeCandidates[0], ffprobeVersion = "unknown";
for (const candidate of ffprobeCandidates) { try { const result = await execFileAsync(candidate, ["-version"], { windowsHide: true }); ffprobe = candidate; ffprobeVersion = result.stdout.split(/\r?\n/)[0] ?? "unknown"; break; } catch {} }
if (ffprobeVersion === "unknown") { console.error("FFprobe not found. Install FFmpeg or set FFPROBE_PATH."); process.exit(3); }
const rootInfo = await stat(root).catch(() => null);
if (!rootInfo?.isDirectory()) { console.error(`Input folder does not exist or is not a directory: ${root}`); process.exit(2); }
const files = [];
async function walk(folder) {
 const entries = await readdir(folder, { withFileTypes: true });
 for (const entry of entries) {
  if (entry.isSymbolicLink()) continue;
  const full = path.join(folder, entry.name);
  if (entry.isDirectory()) { if (!SKIP.has(entry.name.toLowerCase())) await walk(full); }
  else if (entry.isFile()) { const ext = path.extname(entry.name).toLowerCase(); if (VIDEO.has(ext) || AUDIO.has(ext) || IMAGE.has(ext)) { files.push(full); if (files.length > maxFiles) throw new Error(`File limit exceeded (${maxFiles}). Narrow the input folder or raise --max-files.`); } }
 }
}
await walk(root);
const rate = value => { if (!value || value === "0/0" || value === "N/A") return undefined; const [a, b] = value.split("/").map(Number); const result = b ? a / b : Number(a); return Number.isFinite(result) && result > 0 ? Math.round(result * 1000) / 1000 : undefined; };
async function hashFile(file) { const hash = createHash("sha256"); for await (const chunk of createReadStream(file)) hash.update(chunk); return hash.digest("hex"); }
async function mapLimit(items, limit, fn) { const out = new Array(items.length); let cursor = 0; await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => { while (true) { const index = cursor++; if (index >= items.length) return; out[index] = await fn(items[index], index); } })); return out; }
const assets = await mapLimit(files, 3, async (full, index) => {
 const info = await stat(full), extension = path.extname(full).toLowerCase();
 const kind = VIDEO.has(extension) ? "video" : AUDIO.has(extension) ? "audio" : "image";
 const asset = { id: `media-${String(index + 1).padStart(5, "0")}`, path: path.relative(root, full), fileName: path.basename(full), extension, kind, sizeBytes: info.size, modifiedAt: info.mtime.toISOString(), probeStatus: "ok", hasVideo: false, hasAudio: false, issues: [] };
 if (info.size === 0) { asset.probeStatus = "failed"; asset.issues.push("File is empty."); return asset; }
 try {
  const { stdout } = await execFileAsync(ffprobe, ["-v", "error", "-show_entries", "format=duration,format_name,size,bit_rate:stream=index,codec_type,codec_name,width,height,avg_frame_rate,r_frame_rate,sample_rate,channels,channel_layout,duration:stream_tags=rotate", "-of", "json", full], { windowsHide: true, maxBuffer: 8 * 1024 * 1024, timeout: 60000 });
  const data = JSON.parse(stdout), streams = data.streams ?? [], video = streams.find(s => s.codec_type === "video"), audio = streams.find(s => s.codec_type === "audio");
  asset.hasVideo = Boolean(video) || kind === "image"; asset.hasAudio = Boolean(audio); asset.durationSeconds = Number(data.format?.duration ?? video?.duration ?? audio?.duration ?? 0) || undefined;
  asset.formatName = data.format?.format_name; asset.bitRate = Number(data.format?.bit_rate) || undefined;
  if (video) { asset.width = video.width; asset.height = video.height; asset.fps = rate(video.avg_frame_rate) || rate(video.r_frame_rate); asset.videoCodec = video.codec_name; asset.rotation = Number(video.tags?.rotate) || undefined; }
  if (audio) { asset.audioCodec = audio.codec_name; asset.sampleRate = Number(audio.sample_rate) || undefined; asset.channels = audio.channels; }
  if (kind === "video" && !asset.hasVideo) asset.issues.push("No video stream detected.");
  if (kind === "audio" && !asset.hasAudio) asset.issues.push("No audio stream detected.");
  if (!asset.durationSeconds && kind !== "image") asset.issues.push("Duration metadata unavailable.");
  if (hashEnabled) asset.sha256 = await hashFile(full);
 } catch (error) { asset.probeStatus = "failed"; asset.issues.push(error?.stderr?.trim() || error?.message || "FFprobe failed."); }
 return asset;
});
const hashes = new Map();
for (const asset of assets) if (asset.sha256) { const list = hashes.get(asset.sha256) ?? []; list.push(asset.path); hashes.set(asset.sha256, list); }
const duplicateGroups = [...hashes.values()].filter(list => list.length > 1);
const failedFiles = assets.filter(a => a.probeStatus === "failed").length;
const inventory = { schemaVersion: 1, generatedAt: new Date().toISOString(), root, ffprobeVersion, scannedFiles: assets.length, probedFiles: assets.filter(a => a.probeStatus === "ok").length, failedFiles, totalBytes: assets.reduce((sum, a) => sum + a.sizeBytes, 0), assets, warnings: [...(hashEnabled ? [] : ["SHA-256 duplicate detection was not run. Use --hash to enable content hashing."]), ...(duplicateGroups.length ? [`${duplicateGroups.length} duplicate content group(s) found.`] : [])] };
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(inventory, null, 2), "utf8");
console.log(JSON.stringify({ output: outputPath, scannedFiles: inventory.scannedFiles, probedFiles: inventory.probedFiles, failedFiles, totalBytes: inventory.totalBytes, duplicateGroups: duplicateGroups.length, ffprobeVersion }, null, 2));
