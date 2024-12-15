use once_cell::sync::Lazy;
use serde::Serialize;
use std::collections::HashMap;
use std::process::Command;
use std::os::windows::process::CommandExt;
use std::sync::Mutex;
use sysinfo::{ProcessExt, System, SystemExt, Pid};

static CHROME_PROCESSES: Lazy<Mutex<HashMap<String, u32>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

#[derive(Serialize)]
pub struct ChromeResult {
    success: bool,
    message: String,
}

#[tauri::command]
// 打开chrome 指定 user-data-dir
pub fn open_chrome(names: Vec<String>) -> Result<ChromeResult, String> {
    let chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe";

    println!("open_chrome: {:?}", names);
    for name in names {
        // 使用explorer打开Chrome
        let child = Command::new(chrome_path)
            .arg(format!("--user-data-dir=D:\\wallet\\{}", name))
            .spawn()
            .map_err(|e| e.to_string())?;
        let pid = child.id();

        CHROME_PROCESSES
            .lock()
            .map_err(|e| e.to_string())?
            .insert(name.clone(), pid);
    }

    Ok(ChromeResult {
        success: true,
        message: String::from("打开成功"),
    })
}

#[tauri::command]
pub fn close_chrome(names: Vec<String>) -> Result<ChromeResult, String> {
    println!("close_chrome: {:?}", names);

    for name in &names {
        if let Some(pid) = CHROME_PROCESSES
            .lock()
            .map_err(|e| e.to_string())?
            .remove(&name.clone())
        {
            kill_process_by_pid(pid)?;
        }
    }

    Ok(ChromeResult {
        success: true,
        message: format!("已关闭 {}", names.join(",")),
    })
}

#[tauri::command]
pub fn close_all_chrome() -> Result<ChromeResult, String> {
    println!("close_all_chrome");
    Command::new("taskkill")
        .creation_flags(0x08000000)
        .arg("/F")
        .arg("/IM")
        .arg("chrome.exe")
        .spawn()
        .map_err(|e| e.to_string())?;

    CHROME_PROCESSES.lock()
        .map_err(|e| e.to_string())?
        .clear();
    Ok(ChromeResult {
        success: true,
        message: String::from("关闭所有Chrome"),
    })
}

// 杀死指定pid的进程
fn kill_process_by_pid(pid: u32) -> Result<(), String> {
    let sys = System::new_all();
    if let Some(process) = sys.process(Pid::from(pid as usize)) {
        process.kill();
    }
    Ok(())
}
