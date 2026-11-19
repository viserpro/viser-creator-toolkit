import type { CreatorGuide } from "./types.ts";
const HEX=/^#(?:[0-9a-fA-F]{3}){1,2}$/;
export const defaultGuide:CreatorGuide={
 brand:{name:"VISER Creator",niche:"educational short-form video",audience:"general Indonesian audience",platforms:["TikTok","Instagram Reels","YouTube Shorts"],tone:"clear, conversational, evidence-led"},
 video:{width:1080,height:1920,fps:30,targetSeconds:45,maxSceneSeconds:3,codec:"prores4444"},
 pacing:{cutStyle:"fast purposeful cuts",maxPauseSeconds:0.35,oneIdeaPerScene:true},
 hook:{preferredTypes:["conflict","question","counter-intuitive fact"],maxWords:10,visualTreatment:"instant headline with subtle scale-in"},
 subtitles:{mode:"word-by-word",maxWordsPerLine:3,fontFamily:"Arial",fontSize:64,color:"#FFFFFF",highlightColor:"#B7FF32",strokeColor:"#080808",strokeWidth:4,verticalPosition:"bottom"},
 motion:{frequencySeconds:3,kinds:["text-card","kinetic-type","icon"],enter:"spring",exit:"fade",defaultDurationSeconds:2},
 colors:{primary:"#101214",accent:"#B7FF32",secondaryAccent:"#FFC857",background:"#101214",text:"#FFFFFF",mutedText:"#C7CDD1"},
 audio:{musicStyle:"cinematic ambient",musicBelowVoiceDb:-20,fadeInSeconds:0.5,fadeOutSeconds:1,sfxPolicy:"Use sparingly to emphasize transitions or key facts",peakLimitDb:-1},
 storyBeats:[{name:"Hook",startSeconds:0,endSeconds:3},{name:"Context",startSeconds:3,endSeconds:10},{name:"Turning point",startSeconds:10,endSeconds:20},{name:"Takeaway",startSeconds:20,endSeconds:27},{name:"Closing",startSeconds:27,endSeconds:30}],
 avoid:["text covering faces","decorative transitions without narrative purpose","excessive emojis","unlicensed media"],creatorReferences:[],
 tools:{recording:"User supplied footage",editor:"CapCut Desktop",motion:"Remotion",audio:"CapCut or dedicated audio editor",fontSource:"Locally installed or properly licensed fonts"}
};
export function validateGuide(guide:CreatorGuide):string[]{
 const errors:string[]=[];
 if(!guide.brand.name.trim())errors.push("brand.name is required");
 if(!Number.isInteger(guide.video.width)||guide.video.width<1)errors.push("video.width must be a positive integer");
 if(!Number.isInteger(guide.video.height)||guide.video.height<1)errors.push("video.height must be a positive integer");
 if(!Number.isFinite(guide.video.fps)||guide.video.fps<=0)errors.push("video.fps must be greater than zero");
 if(guide.video.maxSceneSeconds<=0)errors.push("video.maxSceneSeconds must be greater than zero");
 for(const [key,value] of Object.entries(guide.colors))if(!HEX.test(value))errors.push(`colors.${key} must be a valid hex color`);
 if(guide.subtitles.maxWordsPerLine<1)errors.push("subtitles.maxWordsPerLine must be at least 1");
 if(guide.subtitles.fontSize<8||guide.subtitles.fontSize>300)errors.push("subtitles.fontSize must be between 8 and 300");
 if(guide.audio.musicBelowVoiceDb>0)errors.push("audio.musicBelowVoiceDb must not be positive");
 if(guide.audio.peakLimitDb>0)errors.push("audio.peakLimitDb must not be positive");
 if(!guide.storyBeats.length)errors.push("storyBeats must contain at least one beat");
 let previousEnd=0;
 for(const beat of guide.storyBeats){if(beat.startSeconds<previousEnd||beat.endSeconds<=beat.startSeconds)errors.push(`story beat "${beat.name}" has invalid or overlapping timing`);previousEnd=beat.endSeconds;}
 return errors;
}
export function resolveBeat(seconds:number,guide:CreatorGuide):string{return guide.storyBeats.find(b=>seconds>=b.startSeconds&&seconds<b.endSeconds)?.name??"Main content";}
