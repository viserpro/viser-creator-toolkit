import type {CreatorGuide} from "./types";
export interface AudioMixPlan{voice:{targetPeakDb:number;priority:"foreground"};music:{gainBelowVoiceDb:number;fadeInSeconds:number;fadeOutSeconds:number};sfx:{policy:string};warnings:string[]}
export function createAudioMixPlan(guide:CreatorGuide,durationSeconds:number):AudioMixPlan{
 const warnings:string[]=[];if(durationSeconds<=0)warnings.push("Duration must be positive before applying audio fades.");if(guide.audio.fadeInSeconds+guide.audio.fadeOutSeconds>durationSeconds)warnings.push("Combined audio fades exceed the project duration.");
 return{voice:{targetPeakDb:guide.audio.peakLimitDb,priority:"foreground"},music:{gainBelowVoiceDb:guide.audio.musicBelowVoiceDb,fadeInSeconds:guide.audio.fadeInSeconds,fadeOutSeconds:guide.audio.fadeOutSeconds},sfx:{policy:guide.audio.sfxPolicy},warnings};
}
