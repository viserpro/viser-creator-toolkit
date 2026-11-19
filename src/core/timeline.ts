import type {MediaInventory,MediaInventoryAsset} from "./media.ts";
export type TrackKind="video"|"audio"|"overlay";
export interface TimelineClip{id:string;assetId:string;name:string;kind:"video"|"audio"|"image";startSeconds:number;sourceInSeconds:number;sourceOutSeconds:number;sourceDurationSeconds:number;durationSeconds:number;enabled:boolean;}
export interface TimelineTrack{id:string;name:string;kind:TrackKind;muted:boolean;locked:boolean;clips:TimelineClip[];}
export interface TimelineProject{schemaVersion:1;title:string;fps:number;width:number;height:number;tracks:TimelineTrack[];durationSeconds:number;sourceInventoryGeneratedAt:string;warnings:string[];}
const round=(n:number)=>Math.round(n*1000)/1000;
function clipFromAsset(asset:MediaInventoryAsset,start:number):TimelineClip{
 const duration=Math.max(0.001,asset.durationSeconds??5);
 return{id:`clip-${asset.id}`,assetId:asset.id,name:asset.fileName,kind:asset.kind==="audio"?"audio":asset.kind==="image"?"image":"video",startSeconds:round(start),sourceInSeconds:0,sourceOutSeconds:round(duration),sourceDurationSeconds:round(duration),durationSeconds:round(duration),enabled:true};
}
export function createRoughCut(inventory:MediaInventory,title="VISER Rough Cut",format={width:1080,height:1920,fps:30}):TimelineProject{
 const videos=inventory.assets.filter(a=>a.kind==="video"&&a.probeStatus==="ok"&&a.hasVideo&&(a.durationSeconds??0)>0);
 const audios=inventory.assets.filter(a=>a.kind==="audio"&&a.probeStatus==="ok"&&a.hasAudio&&(a.durationSeconds??0)>0);
 const videoClips:TimelineClip[]=[];let cursor=0;for(const asset of videos){const clip=clipFromAsset(asset,cursor);videoClips.push(clip);cursor+=clip.durationSeconds;}
 const audioClips=audios.map(asset=>clipFromAsset(asset,0));
 const tracks:TimelineTrack[]=[
 {id:"track-video-1",name:"VIDEO 01 · MAIN",kind:"video",muted:false,locked:false,clips:videoClips},
 {id:"track-overlay-1",name:"OVERLAY / GRAPHICS",kind:"overlay",muted:false,locked:false,clips:[]},
 {id:"track-audio-1",name:"AUDIO 01 · MUSIC / VOICE",kind:"audio",muted:false,locked:false,clips:audioClips},
 ];
 const warnings:string[]=[];if(!videos.length)warnings.push("No usable video files were found. Add video assets to create a rough cut.");if(audios.length>1)warnings.push("Multiple audio files start at timeline zero. Review and position voiceover/music manually.");if(inventory.failedFiles)warnings.push(`${inventory.failedFiles} files failed media probing and were excluded from the rough cut.`);
 return{schemaVersion:1,title,width:format.width,height:format.height,fps:format.fps,tracks,durationSeconds:round(Math.max(cursor,...audioClips.map(c=>c.durationSeconds),0)),sourceInventoryGeneratedAt:inventory.generatedAt,warnings};
}
export function validateTimeline(project:TimelineProject):string[]{
 const errors:string[]=[];if(project.schemaVersion!==1)errors.push("Unsupported timeline schema version.");if(!Number.isFinite(project.fps)||project.fps<=0)errors.push("Timeline FPS must be positive.");
 const ids=new Set<string>();for(const track of project.tracks){if(ids.has(track.id))errors.push(`Duplicate track id: ${track.id}`);ids.add(track.id);for(const clip of track.clips){if(ids.has(clip.id))errors.push(`Duplicate clip id: ${clip.id}`);ids.add(clip.id);if(!Number.isFinite(clip.startSeconds)||clip.startSeconds<0)errors.push(`Clip ${clip.name} has invalid start time.`);if(!Number.isFinite(clip.sourceInSeconds)||!Number.isFinite(clip.sourceOutSeconds)||clip.sourceInSeconds<0||clip.sourceOutSeconds<=clip.sourceInSeconds)errors.push(`Clip ${clip.name} has invalid source trim.`);if(Math.abs(clip.durationSeconds-(clip.sourceOutSeconds-clip.sourceInSeconds))>0.01)errors.push(`Clip ${clip.name} duration does not match source trim.`);}}
 return errors;
}
function updateClip(project:TimelineProject,clipId:string,update:(clip:TimelineClip)=>TimelineClip):TimelineProject{
 let found=false;const tracks=project.tracks.map(track=>({...track,clips:track.clips.map(clip=>{if(clip.id!==clipId)return clip;found=true;return update(clip);})}));if(!found)throw new Error(`Clip not found: ${clipId}`);
 const duration=Math.max(0,...tracks.flatMap(t=>t.clips.map(c=>c.startSeconds+c.durationSeconds)));return{...project,tracks,durationSeconds:round(duration)};
}
export function moveClip(project:TimelineProject,clipId:string,startSeconds:number):TimelineProject{
 if(!Number.isFinite(startSeconds)||startSeconds<0)throw new Error("Clip start time must be zero or greater.");
 return updateClip(project,clipId,clip=>({...clip,startSeconds:round(startSeconds)}));
}
export function trimClip(project:TimelineProject,clipId:string,sourceInSeconds:number,sourceOutSeconds:number):TimelineProject{
 if(!Number.isFinite(sourceInSeconds)||!Number.isFinite(sourceOutSeconds)||sourceInSeconds<0||sourceOutSeconds<=sourceInSeconds)throw new Error("Invalid source trim range.");
 return updateClip(project,clipId,clip=>{if(sourceOutSeconds>clip.sourceDurationSeconds+1e-6)throw new Error("Trim exceeds the available source duration.");return{...clip,sourceInSeconds:round(sourceInSeconds),sourceOutSeconds:round(sourceOutSeconds),durationSeconds:round(sourceOutSeconds-sourceInSeconds)};});
}
export function splitClip(project:TimelineProject,clipId:string,atTimelineSeconds:number):TimelineProject{
 let found=false;const tracks=project.tracks.map(track=>({...track,clips:track.clips.flatMap(clip=>{if(clip.id!==clipId)return[clip];found=true;const relative=atTimelineSeconds-clip.startSeconds;if(relative<=0.001||relative>=clip.durationSeconds-0.001)throw new Error("Split point must be inside the clip.");const sourceSplit=clip.sourceInSeconds+relative;const left:TimelineClip={...clip,sourceOutSeconds:round(sourceSplit),durationSeconds:round(relative)};const right:TimelineClip={...clip,id:`${clip.id}-split-${Math.round(atTimelineSeconds*1000)}`,name:`${clip.name} (split)`,startSeconds:round(atTimelineSeconds),sourceInSeconds:round(sourceSplit),durationSeconds:round(clip.durationSeconds-relative)};return[left,right];})}));if(!found)throw new Error(`Clip not found: ${clipId}`);return{...project,tracks,durationSeconds:round(Math.max(...tracks.flatMap(t=>t.clips.map(c=>c.startSeconds+c.durationSeconds)),0))};
}
export function removeClip(project:TimelineProject,clipId:string):TimelineProject{
 let found=false;const tracks=project.tracks.map(track=>({...track,clips:track.clips.filter(clip=>{if(clip.id===clipId){found=true;return false;}return true;})}));if(!found)throw new Error(`Clip not found: ${clipId}`);return{...project,tracks,durationSeconds:round(Math.max(...tracks.flatMap(t=>t.clips.map(c=>c.startSeconds+c.durationSeconds)),0))};
}
export function addInventoryAssetToTimeline(project:TimelineProject,asset:MediaInventoryAsset):TimelineProject{
 const kind=asset.kind==="audio"?"audio":asset.kind==="image"?"overlay":"video";const track=project.tracks.find(t=>t.kind===kind);if(!track)throw new Error(`No ${kind} track available.`);
 const start=kind==="audio"?0:project.durationSeconds;const clip=clipFromAsset(asset,start);const tracks=project.tracks.map(t=>t.id===track.id?{...t,clips:[...t.clips,clip]}:t);return{...project,tracks,durationSeconds:round(Math.max(project.durationSeconds,start+clip.durationSeconds))};
}
