export type MediaKind = "video" | "audio" | "image" | "unknown";
export interface MediaInventoryAsset {
 id:string; path:string; fileName:string; extension:string; kind:MediaKind; sizeBytes:number; modifiedAt:string;
 probeStatus:"ok"|"failed"|"skipped"; durationSeconds?:number; width?:number; height?:number; fps?:number;
 videoCodec?:string; audioCodec?:string; formatName?:string; bitRate?:number; hasVideo:boolean; hasAudio:boolean;
 sampleRate?:number; channels?:number; rotation?:number; sha256?:string; issues:string[];
}
export interface MediaInventory {
 schemaVersion:1; generatedAt:string; root:string; ffprobeVersion:string; scannedFiles:number; probedFiles:number;
 failedFiles:number; totalBytes:number; assets:MediaInventoryAsset[]; warnings:string[];
}
export interface MediaSummary { videos:number; audios:number; images:number; failed:number; totalDurationSeconds:number; totalBytes:number; }
export function summarizeInventory(inventory:MediaInventory):MediaSummary{
 const summary:MediaSummary={videos:0,audios:0,images:0,failed:0,totalDurationSeconds:0,totalBytes:0};
 for(const asset of inventory.assets){if(asset.kind==="video")summary.videos++;else if(asset.kind==="audio")summary.audios++;else if(asset.kind==="image")summary.images++;if(asset.probeStatus==="failed")summary.failed++;summary.totalDurationSeconds+=asset.durationSeconds??0;summary.totalBytes+=asset.sizeBytes;}
 return summary;
}
export function validateInventory(value:unknown):string[]{
 if(!value||typeof value!=="object")return ["Inventory must be a JSON object."];
 const data=value as Partial<MediaInventory>;const errors:string[]=[];
 if(data.schemaVersion!==1)errors.push("Unsupported media inventory schemaVersion.");
 if(!Array.isArray(data.assets))errors.push("Inventory assets must be an array.");
 else data.assets.forEach((asset,index)=>{if(!asset||typeof asset!=="object"){errors.push(`Asset ${index+1} is invalid.`);return;}const item=asset as Partial<MediaInventoryAsset>;if(typeof item.path!=="string"||!item.path)errors.push(`Asset ${index+1} has no path.`);if(typeof item.sizeBytes!=="number"||item.sizeBytes<0)errors.push(`Asset ${index+1} has invalid sizeBytes.`);if(!["video","audio","image","unknown"].includes(item.kind??""))errors.push(`Asset ${index+1} has invalid media kind.`);if(item.durationSeconds!==undefined&&(!Number.isFinite(item.durationSeconds)||item.durationSeconds<0))errors.push(`Asset ${index+1} has invalid duration.`);});
 return errors;
}
export function formatBytes(bytes:number):string{if(!Number.isFinite(bytes)||bytes<0)return "—";if(bytes<1024)return `${bytes} B`;const units=["KB","MB","GB","TB"];let value=bytes/1024,index=0;while(value>=1024&&index<units.length-1){value/=1024;index++;}return `${value.toFixed(value>=100?0:1)} ${units[index]}`;}
