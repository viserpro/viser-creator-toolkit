export type SubtitleMode = "word-by-word" | "sentence";
export type MotionKind = "text-card" | "kinetic-type" | "icon" | "diagram";
export type EasingPreset = "spring" | "fade" | "slide" | "scale";
export interface CreatorGuide {
 brand:{name:string;handle?:string;niche:string;audience:string;platforms:string[];tone:string};
 video:{width:number;height:number;fps:number;targetSeconds:number;maxSceneSeconds:number;codec:"h264"|"prores4444"};
 pacing:{cutStyle:string;maxPauseSeconds:number;oneIdeaPerScene:boolean};
 hook:{preferredTypes:string[];maxWords:number;visualTreatment:string};
 subtitles:{mode:SubtitleMode;maxWordsPerLine:number;fontFamily:string;fontSize:number;color:string;highlightColor:string;strokeColor:string;strokeWidth:number;verticalPosition:"top"|"center"|"bottom"};
 motion:{frequencySeconds:number;kinds:MotionKind[];enter:EasingPreset;exit:EasingPreset;defaultDurationSeconds:number};
 colors:{primary:string;accent:string;secondaryAccent:string;background:string;text:string;mutedText:string};
 audio:{musicStyle:string;musicBelowVoiceDb:number;fadeInSeconds:number;fadeOutSeconds:number;sfxPolicy:string;peakLimitDb:number};
 storyBeats:Array<{name:string;startSeconds:number;endSeconds:number}>;
 avoid:string[];creatorReferences:Array<{handle:string;reason:string}>;
 tools:{recording:string;editor:string;motion:string;audio:string;fontSource:string};
}
export interface WordCue{text:string;startFrame:number;endFrame:number;highlighted?:boolean}
export interface Scene{id:string;index:number;text:string;startFrame:number;endFrame:number;durationFrames:number;beat:string;subtitleLines:string[];wordCues:WordCue[];motion:{kind:MotionKind;enter:EasingPreset;exit:EasingPreset}}
export interface SceneProject{version:1;title:string;fps:number;width:number;height:number;totalFrames:number;durationSeconds:number;scenes:Scene[];warnings:string[]}
