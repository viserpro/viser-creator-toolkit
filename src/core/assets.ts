export interface MediaAsset{path:string;extension:string;sizeBytes?:number;durationSeconds?:number;hasAudio?:boolean;hasVideo?:boolean}
export interface AssetIssue{path:string;severity:"error"|"warning";message:string}
const VIDEO=new Set([".mp4",".mov",".m4v",".webm",".mkv"]);const AUDIO=new Set([".wav",".mp3",".m4a",".aac",".flac",".ogg"]);
export function inspectAssetManifest(assets:MediaAsset[]):AssetIssue[]{
 const issues:AssetIssue[]=[];const seen=new Set<string>();
 for(const asset of assets){const normalized=asset.path.trim().toLocaleLowerCase();if(!normalized){issues.push({path:asset.path,severity:"error",message:"Asset path is empty."});continue;}if(seen.has(normalized))issues.push({path:asset.path,severity:"warning",message:"Duplicate asset path in manifest."});seen.add(normalized);
 const ext=asset.extension.toLocaleLowerCase().startsWith(".")?asset.extension.toLocaleLowerCase():`.${asset.extension.toLocaleLowerCase()}`;
 if(!VIDEO.has(ext)&&!AUDIO.has(ext)&&![".png",".jpg",".jpeg",".webp",".gif"].includes(ext))issues.push({path:asset.path,severity:"warning",message:`Unrecognized media extension: ${ext}`});
 if(asset.sizeBytes===0)issues.push({path:asset.path,severity:"error",message:"File is empty."});
 if(asset.durationSeconds!==undefined&&asset.durationSeconds<=0)issues.push({path:asset.path,severity:"error",message:"Media duration must be greater than zero."});
 if(VIDEO.has(ext)&&asset.hasVideo===false)issues.push({path:asset.path,severity:"error",message:"Expected video stream, but metadata reports no video stream."});
 if(AUDIO.has(ext)&&asset.hasAudio===false)issues.push({path:asset.path,severity:"error",message:"Expected audio stream, but metadata reports no audio stream."});
 }return issues;
}
