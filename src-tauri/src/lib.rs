use serde::Serialize;
use std::{
    fs,
    path::{Path, PathBuf},
};

#[derive(Serialize)]
struct RuntimeInfo {
    os: &'static str,
    arch: &'static str,
    app_version: String,
    ffprobe_available: bool,
}

#[derive(Serialize)]
struct MediaFile {
    name: String,
    path: String,
    extension: String,
    size_bytes: u64,
}

#[tauri::command]
fn get_runtime_info(app: tauri::AppHandle) -> RuntimeInfo {
    RuntimeInfo {
        os: std::env::consts::OS,
        arch: std::env::consts::ARCH,
        app_version: app.package_info().version.to_string(),
        ffprobe_available: find_ffprobe().is_some(),
    }
}

fn find_ffprobe() -> Option<PathBuf> {
    if let Ok(path) = std::env::var("FFPROBE_PATH") {
        let candidate = PathBuf::from(path);
        if candidate.is_file() {
            return Some(candidate);
        }
    }
    #[cfg(target_os = "windows")]
    let candidates = vec![PathBuf::from(r"C:\ffmpeg\bin\ffprobe.exe")];
    #[cfg(not(target_os = "windows"))]
    let candidates: Vec<PathBuf> = vec![
        PathBuf::from("/opt/homebrew/bin/ffprobe"),
        PathBuf::from("/usr/local/bin/ffprobe"),
    ];
    candidates.into_iter().find(|p| p.is_file()).or_else(|| {
        let name = if cfg!(windows) { "where" } else { "which" };
        let binary = if cfg!(windows) {
            "ffprobe.exe"
        } else {
            "ffprobe"
        };
        std::process::Command::new(name)
            .arg(binary)
            .output()
            .ok()
            .filter(|o| o.status.success())
            .and_then(|o| String::from_utf8(o.stdout).ok())
            .map(|s| PathBuf::from(s.lines().next().unwrap_or("").trim()))
            .filter(|p| p.is_file())
    })
}

fn collect_media(
    root: &Path,
    output: &mut Vec<MediaFile>,
    count: &mut usize,
) -> Result<(), String> {
    if *count >= 10_000 {
        return Ok(());
    }
    let entries = fs::read_dir(root)
        .map_err(|e| format!("Tidak dapat membaca folder {}: {e}", root.display()))?;
    for entry in entries {
        if *count >= 10_000 {
            break;
        }
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        let kind = entry.file_type().map_err(|e| e.to_string())?;
        if kind.is_symlink() {
            continue;
        }
        if kind.is_dir() {
            let name = entry.file_name().to_string_lossy().to_ascii_lowercase();
            if !matches!(
                name.as_str(),
                "node_modules"
                    | ".git"
                    | ".next"
                    | "dist"
                    | "build"
                    | "cache"
                    | "$recycle.bin"
                    | "system volume information"
            ) {
                collect_media(&path, output, count)?;
            }
        } else if kind.is_file() {
            let extension = path
                .extension()
                .unwrap_or_default()
                .to_string_lossy()
                .to_ascii_lowercase();
            let supported = matches!(
                extension.as_str(),
                "mp4"
                    | "mov"
                    | "m4v"
                    | "mkv"
                    | "webm"
                    | "avi"
                    | "mts"
                    | "m2ts"
                    | "3gp"
                    | "mxf"
                    | "ts"
                    | "flv"
                    | "wmv"
                    | "wav"
                    | "mp3"
                    | "m4a"
                    | "aac"
                    | "flac"
                    | "ogg"
                    | "opus"
                    | "wma"
                    | "aiff"
                    | "aif"
                    | "alac"
                    | "jpg"
                    | "jpeg"
                    | "png"
                    | "webp"
                    | "gif"
                    | "bmp"
                    | "tif"
                    | "tiff"
                    | "heic"
                    | "heif"
            );
            if supported {
                let metadata = entry.metadata().map_err(|e| e.to_string())?;
                output.push(MediaFile {
                    name: entry.file_name().to_string_lossy().to_string(),
                    path: path.to_string_lossy().to_string(),
                    extension,
                    size_bytes: metadata.len(),
                });
                *count += 1;
            }
        }
    }
    Ok(())
}

#[tauri::command]
fn list_media_files(root: String) -> Result<Vec<MediaFile>, String> {
    let path = PathBuf::from(root);
    if !path.is_dir() {
        return Err("Folder media tidak ditemukan atau bukan direktori.".into());
    }
    let mut output = Vec::new();
    let mut count = 0;
    collect_media(&path, &mut output, &mut count)?;
    output.sort_by(|a, b| a.path.to_lowercase().cmp(&b.path.to_lowercase()));
    Ok(output)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![get_runtime_info, list_media_files])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
