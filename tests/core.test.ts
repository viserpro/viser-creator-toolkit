import test from "node:test";
import assert from "node:assert/strict";
import { defaultGuide, validateGuide } from "../src/core/guide.ts";
import { compileScript } from "../src/core/compiler.ts";
import { inspectAssetManifest } from "../src/core/assets.ts";
import { createAudioMixPlan } from "../src/core/audio.ts";

test("default guide is valid",()=>{assert.deepEqual(validateGuide(defaultGuide),[]);});
test("compiler makes one scene per non-empty line with three-second default",()=>{
 const result=compileScript("Hook pembuka yang kuat.\nSatu ide visual berikutnya.",defaultGuide,{highlightWords:["kuat"]});
 assert.equal(result.scenes.length,2);assert.equal(result.scenes[0].durationFrames,90);assert.equal(result.totalFrames,180);
 assert.equal(result.scenes[0].wordCues.find(c=>c.text==="kuat.")?.highlighted,true);
 assert.equal(result.scenes[1].startFrame,90);
});
test("compiler wraps subtitles and flags overlong hook",()=>{
 const result=compileScript("Ini hook yang sengaja dibuat sangat panjang sekali agar melewati batas kata dalam guidebook.",defaultGuide);
 assert.ok(result.scenes[0].subtitleLines.length>1);
 assert.ok(result.warnings.some(w=>w.includes("hook")));
});
test("compiler rejects empty scripts and invalid timing",()=>{
 assert.throws(()=>compileScript("  \n ",defaultGuide),/Script is empty/);
 assert.throws(()=>compileScript("Satu scene",defaultGuide,{secondsPerLine:4}),/secondsPerLine/);
});
test("asset preflight detects duplicate and invalid media",()=>{
 const issues=inspectAssetManifest([{path:"a.mp4",extension:"mp4",sizeBytes:0,hasVideo:false},{path:"a.mp4",extension:".mp4"}]);
 assert.ok(issues.some(i=>i.severity==="error"&&i.message==="File is empty."));
 assert.ok(issues.some(i=>i.message==="Duplicate asset path in manifest."));
 assert.ok(issues.some(i=>i.message.includes("no video stream")));
});
test("audio plan carries guidebook mix levels and warns on overlong fades",()=>{
 const plan=createAudioMixPlan(defaultGuide,1);
 assert.equal(plan.music.gainBelowVoiceDb,-20);assert.equal(plan.voice.targetPeakDb,-1);
 assert.ok(plan.warnings.length>0);
});

import { summarizeInventory, validateInventory, type MediaInventory } from "../src/core/media.ts";
import { createRoughCut, moveClip, removeClip, splitClip, trimClip, validateTimeline } from "../src/core/timeline.ts";

const sampleInventory:MediaInventory={schemaVersion:1,generatedAt:"2026-11-19T00:00:00.000Z",root:"D:/Footage",ffprobeVersion:"ffprobe test",scannedFiles:3,probedFiles:2,failedFiles:0,totalBytes:3000,warnings:[],assets:[
 {id:"v1",path:"a.mp4",fileName:"a.mp4",extension:".mp4",kind:"video",sizeBytes:1000,modifiedAt:"",probeStatus:"ok",durationSeconds:4,width:1920,height:1080,fps:30,hasVideo:true,hasAudio:true,issues:[]},
 {id:"v2",path:"b.mp4",fileName:"b.mp4",extension:".mp4",kind:"video",sizeBytes:1000,modifiedAt:"",probeStatus:"ok",durationSeconds:3,width:1920,height:1080,fps:30,hasVideo:true,hasAudio:false,issues:[]},
 {id:"a1",path:"voice.wav",fileName:"voice.wav",extension:".wav",kind:"audio",sizeBytes:1000,modifiedAt:"",probeStatus:"ok",durationSeconds:6,hasVideo:false,hasAudio:true,issues:[]},
]};
test("media inventory validates and summarizes real metadata",()=>{assert.deepEqual(validateInventory(sampleInventory),[]);assert.deepEqual(summarizeInventory(sampleInventory),{videos:2,audios:1,images:0,failed:0,totalDurationSeconds:13,totalBytes:3000});});
test("rough cut places video sequentially and audio on its own track",()=>{const timeline=createRoughCut(sampleInventory);assert.equal(timeline.tracks[0].clips[1].startSeconds,4);assert.equal(timeline.tracks[2].clips[0].startSeconds,0);assert.equal(timeline.durationSeconds,7);assert.deepEqual(validateTimeline(timeline),[]);});
test("timeline supports non-destructive trim, split, move and remove",()=>{const initial=createRoughCut(sampleInventory);const clip=initial.tracks[0].clips[0];const trimmed=trimClip(initial,clip.id,1,3.5);assert.equal(trimmed.tracks[0].clips[0].durationSeconds,2.5);const split=splitClip(trimmed,clip.id,1.25);assert.equal(split.tracks[0].clips.length,3);assert.equal(split.tracks[0].clips[1].sourceInSeconds,2.25);const moved=moveClip(split,clip.id,0.5);assert.equal(moved.tracks[0].clips[0].startSeconds,0.5);const removed=removeClip(moved,clip.id);assert.equal(removed.tracks[0].clips.length,2);assert.deepEqual(validateTimeline(removed),[]);});
test("timeline rejects invalid trim, negative move and edge split",()=>{const project=createRoughCut(sampleInventory),id=project.tracks[0].clips[0].id;assert.throws(()=>trimClip(project,id,0,9),/exceeds/);assert.throws(()=>moveClip(project,id,-1),/zero or greater/);assert.throws(()=>splitClip(project,id,0),/inside/);});

test("media inventory rejects unsupported schema and malformed assets",()=>{assert.ok(validateInventory({schemaVersion:9,assets:[]}).some(x=>x.includes("schemaVersion")));assert.ok(validateInventory({schemaVersion:1,assets:[{path:"",sizeBytes:-1,kind:"other"}]}).length>=3);});
