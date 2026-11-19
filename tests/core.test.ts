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
