// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use dirs::desktop_dir;
use std::{path::PathBuf, process::Command};

#[tauri::command]

fn open_chrome(path: String)-> PathBuf {
    let desk_path = desktop_dir().ok_or("Failed to get desktop path").expect("出错");
    let chrome_path = desk_path.join("chrome100").join(path + ".lnk");
    println!("path: {:?}", chrome_path);

    return chrome_path;
    // Command::new("cmd")
    //     .args(&["/C", "start", chrome_path.to_str().unwrap()])
    //     .spawn()
    //     .map_err(|e| e.to_string())?;
    // Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![open_chrome])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
