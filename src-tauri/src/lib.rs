
mod open;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            open::open_chrome, 
            open::close_chrome,
            open::close_all_chrome,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
