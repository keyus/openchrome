use std::thread;
mod open;
mod chrome_app;
// mod db;
mod db_keshun;

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
            open::open_tg,
            open::close_tg,
            open::close_all_tg,
            chrome_app::install_chrome_extension,
            chrome_app::uninstall_chrome_extension,
        ])
        .setup(|app|{
            
            db_keshun::init_db(app.handle().clone());
            
            // 启动监听线程
            let app_handle = app.handle().clone();
            thread::spawn(move || {
                if let Err(e) = open::monitor_chrome_processes(app_handle){
                    eprintln!("Error monitoring Chrome processes: {}", e);
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    
}
