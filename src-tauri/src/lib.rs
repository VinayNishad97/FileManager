
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::Serialize;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Wellcome {}! to The File mannager", name)
}
#[derive(Serialize)]
struct FileEntry{
    name:String,
    is_dir:bool
}
#[tauri::command]
fn create_file(path: String) -> Result<(), String> {
    std::fs::write(&path, "Add content")
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn create_folder(path: String) -> Result<(), String> {
    std::fs::create_dir(&path)
        .map_err(|e| e.to_string())
}
#[tauri::command]
fn read_dir(path:String)->Vec<FileEntry>{
      let mut result = Vec::new();

    if let Ok(entries) = std::fs::read_dir(path) {
        for entry in entries {
            match entry {
                Ok(entry)=> result.push(FileEntry {
                name: entry.file_name().to_string_lossy().to_string(),
                is_dir: entry.path().is_dir(),
            }),
            Err(err)=> println!("there is an error {:?}",err)
            }
           
        }
    }

    result
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
         .plugin(tauri_plugin_fs::init()) 
        .invoke_handler(tauri::generate_handler![greet,read_dir,create_file,create_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
