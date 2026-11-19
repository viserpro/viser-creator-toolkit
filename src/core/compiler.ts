import type {CreatorGuide,Scene,SceneProject,WordCue} from "./types.ts";
import {resolveBeat,validateGuide} from "./guide.ts";
export interface CompileOptions{title?:string;secondsPerLine?:number;highlightWords?:string[]}
function splitLines(script:string):string[]{return script.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);}
function buildWordCues(text:string,startFrame:number,durationFrames:number,highlights:Set<string>):WordCue[]{
 const words=text.split(/\s+/).filter(Boolean);if(!words.length)return [];
 const weights=words.map(word=>Math.max(1,word.replace(/[^\p{L}\p{N}]/gu,"").length));
 const total=weights.reduce((sum,value)=>sum+value,0);let consumed=0;
 return words.map((word,index)=>{const cueStart=startFrame+Math.floor(consumed/total*durationFrames);consumed+=weights[index];const cueEnd=index===words.length-1?startFrame+durationFrames:startFrame+Math.max(1,Math.floor(consumed/total*durationFrames));const key=word.toLocaleLowerCase("id-ID").replace(/[^\p{L}\p{N}]/gu,"");return{text:word,startFrame:cueStart,endFrame:Math.max(cueStart+1,cueEnd),highlighted:highlights.has(key)};});
}
export function compileScript(script:string,guide:CreatorGuide,options:CompileOptions={}):SceneProject{
 const errors=validateGuide(guide);if(errors.length)throw new Error(`Invalid guidebook:\n- ${errors.join("\n- ")}`);
 const lines=splitLines(script);if(!lines.length)throw new Error("Script is empty. Add one scene sentence per line.");
 const fps=guide.video.fps;const seconds=options.secondsPerLine??guide.video.maxSceneSeconds;
 if(seconds<=0||seconds>guide.video.maxSceneSeconds)throw new Error(`secondsPerLine must be between 0 and ${guide.video.maxSceneSeconds}`);
 const frames=Math.max(1,Math.round(seconds*fps));const highlights=new Set((options.highlightWords??[]).map(w=>w.toLocaleLowerCase("id-ID")));
 const scenes:Scene[]=lines.map((text,index)=>{const start=index*frames;const words=text.split(/\s+/).filter(Boolean);const subtitleLines:string[]=[];for(let i=0;i<words.length;i+=guide.subtitles.maxWordsPerLine)subtitleLines.push(words.slice(i,i+guide.subtitles.maxWordsPerLine).join(" "));return{id:`scene-${String(index+1).padStart(3,"0")}`,index,text,startFrame:start,endFrame:start+frames,durationFrames:frames,beat:resolveBeat(start/fps,guide),subtitleLines,wordCues:buildWordCues(text,start,frames,highlights),motion:{kind:guide.motion.kinds[index%guide.motion.kinds.length]??"text-card",enter:guide.motion.enter,exit:guide.motion.exit}};});
 const totalFrames=scenes[scenes.length-1].endFrame;const warnings:string[]=[];
 if(lines.length>1)warnings.push("One non-empty line equals one scene. Review timing against the actual voiceover.");
 if(scenes[0].text.split(/\s+/).length>guide.hook.maxWords)warnings.push(`Opening hook exceeds the guidebook limit of ${guide.hook.maxWords} words.`);
 if(totalFrames/fps>guide.video.targetSeconds)warnings.push(`Compiled duration (${(totalFrames/fps).toFixed(1)}s) exceeds target (${guide.video.targetSeconds}s).`);
 return{version:1,title:options.title?.trim()||"Untitled VISER project",fps,width:guide.video.width,height:guide.video.height,totalFrames,durationSeconds:totalFrames/fps,scenes,warnings};
}
