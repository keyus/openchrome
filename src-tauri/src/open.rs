
use dirs::desktop_dir;
use sysinfo::{System, SystemExt,};
use std::process::{Command};
use std::collections::HashMap;
use std::sync::Mutex;
use once_cell::sync::Lazy;
use serde::Serialize;

static CHROME_PROCESSES: Lazy<Mutex<HashMap<String, u32>>> = Lazy::new(|| Mutex::new(HashMap::new()));


#[derive(Serialize)]
pub struct ChromeResult {
    success: bool,
    message: String,
    name: String,
}

#[tauri::command]
// 快捷方式位于：C:\Users\kissw\Desktop\chrome100\
// 快捷方式名称：chrome100.lnk, eth.lnk
// 打开指定的快捷方式
pub fn open_chrome(name: String) -> Result<ChromeResult, String> {
    let desktop_dir = desktop_dir()
        .ok_or("Could not find desktop directory")?;
    let full_path = desktop_dir
        .join("chrome100")
        .join(format!("{}.lnk", name));
    
    let path_str = full_path.to_str()
        .ok_or("Invalid path: non-UTF8 path")?;

    println!("path_str: {}", path_str);
    let chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe";
    
    // 使用explorer打开Chrome
    let child = Command::new(chrome_path)
        .arg(format!("--user-data-dir=D:\\wallet\\{}", name)) 
        .spawn()
        .map_err(|e| e.to_string())?;
    let pid = child.id();
    println!("打开chrome pid(): {}", pid);

    CHROME_PROCESSES.lock()
        .map_err(|e| e.to_string())?
        .insert(name.clone(), pid);

    Ok(ChromeResult {
        success: true,
        message: format!("打开成功 {}", name),
        name: name,
    })
}


#[tauri::command]
pub fn close_chrome(name: String) -> Result<ChromeResult, String> {
    println!("close_chrome: {}", name);
    let mut sys = System::new_all();
    sys.refresh_processes();

    if let Some(pid) = CHROME_PROCESSES.lock()
        .map_err(|e| e.to_string())?
        .remove(&name)
    {
        kill_process_by_pid(pid)?;
    }
    Ok(ChromeResult {
        success: true,
        message: format!("已关闭 {}", name),
        name: name.clone(),
    })
}

fn kill_process_by_pid(pid: u32) -> Result<(), String> {
    Command::new("taskkill")
        .arg("/PID")
        .arg(pid.to_string())
        .arg("/F")
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}
