use once_cell::sync::Lazy;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use std::os::windows::process::CommandExt;
use std::process::Command;
use std::sync::Mutex;
use std::{error::Error, thread};
use sysinfo::{Pid, ProcessExt, System, SystemExt};
use tauri::Emitter;

static CHROME_PROCESSES: Lazy<Mutex<HashMap<String, u32>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));
    
static TG_PROCESSES: Lazy<Mutex<HashMap<String, u32>>> =
Lazy::new(|| Mutex::new(HashMap::new()));

#[derive(Serialize)]
pub struct ChromeResult {
    success: bool,
    message: String,
}

#[derive(Serialize,Debug, Deserialize)]
pub struct NameInfo {
    name: String,
    chrome_version: Option<String>,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct OpenInstance {
    names: Vec<NameInfo>
}

#[tauri::command]
pub fn open_chrome(options: Vec<NameInfo> ) -> Result<ChromeResult, String> {
    println!("open_chrome: {:?}", options);
    let chrome_path: String = r"C:\Program Files\Google\Chrome\Application\chrome.exe".to_string();

    for it in options {
        let name = it.name;
        let chrome_version = it.chrome_version;

        let user_data_dir = format!("--user-data-dir=D:\\chrome100 app\\{}", name);

        let mut command = Command::new(chrome_path.clone());
        command.arg(user_data_dir);
        if let Some(version) = chrome_version {
            let user_agent = format!(
                "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{} Safari/537.36",
                version
            );
            command.arg(user_agent);
        }

        // 使用explorer打开Chrome
        let child = command.spawn().map_err(|e| e.to_string())?;
            //加载扩展
            // .arg("--load-extension=D:\\tools\\openchrome\\proxy\\")
            //指定代理服务器
            // .arg("--proxy-server=http://198.23.239.134:6540")
            // 启动url
            // .arg("http://your-startup-url.com?param1=value1&param2=value2")
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

    CHROME_PROCESSES.lock().map_err(|e| e.to_string())?.clear();
    Ok(ChromeResult {
        success: true,
        message: String::from("关闭所有Chrome"),
    })
}



pub fn monitor_chrome_processes(app_handle: tauri::AppHandle) -> Result<(), Box<dyn Error>> {
    let mut sys = System::new_all();

    loop {
        sys.refresh_processes();

        let mut closed_names = Vec::new();
        {
            let mut processes = CHROME_PROCESSES.lock().unwrap();

            // 检查每个已记录的 Chrome 进程
            processes.retain(|name, &mut pid| {
                let is_running = sys.process(Pid::from(pid as usize)).is_some();
                if !is_running {
                    closed_names.push(name.clone());
                }
                is_running
            });
        }

        // 如果有进程关闭，通知前端并更新记录
        if !closed_names.is_empty() {
            println!("closed_names: {:?}", closed_names);
            {
                for name in &closed_names {
                    CHROME_PROCESSES
                        .lock()
                        .map_err(|e| e.to_string())?
                        .remove(&name.clone());
                }
            }
            // 发送事件到前端
            app_handle.emit("chrome-closed", closed_names).unwrap();
        }

        // 休眠一段时间再检查
        thread::sleep(std::time::Duration::from_secs(3));
    }
}



#[tauri::command]
pub fn open_tg(names: Vec<String>) -> Result<ChromeResult,String>{
    let tg_root_path = r"D:\telegram100-app";
    
    for name in &names  {
        let tg_exe = format!("{}\\{}\\Telegram.exe", tg_root_path, name);
        let mut child = Command::new(tg_exe)
        .spawn()
        .map_err(|e| e.to_string())?;

        match child.try_wait() {
            Ok(Some(status)) => {
                println!("tg 进程提前退出，退出状态：{}", status);
                return Err("tg 进程启动失败".to_string());
            }
            Ok(None) => {
                println!("tg 启动成功, {}", child.id());
                TG_PROCESSES
                .lock()
                .map_err(|e| e.to_string())?
                .insert(name.clone(), child.id());
            }
            Err(e) => {
                println!("检查 tg 进程状态失败：{}", e);
                return Err(e.to_string());
            }
        }
    }
    Ok(ChromeResult {
        success: true,
        message: String::from("打开成功"),
    })
}



#[tauri::command]
pub fn close_tg(names: Vec<String>) -> Result<ChromeResult, String> {
    println!("close_tg: {:?}", names);

    for name in &names {
        if let Some(pid) = TG_PROCESSES
            .lock()
            .map_err(|e| e.to_string())?
            .remove(&name.clone())
        {
            println!("需要关闭的tg进程, {}", pid);
            kill_process_by_pid(pid)?;
        }
    }

    Ok(ChromeResult {
        success: true,
        message: format!("已关闭 {}", names.join(",")),
    })
}


#[tauri::command]
pub fn close_all_tg() -> Result<ChromeResult, String> {
    println!("close_all_tg");
    Command::new("taskkill")
        .creation_flags(0x08000000)
        .arg("/F")
        .arg("/IM")
        .arg("Telegram.exe")
        .spawn()
        .map_err(|e| e.to_string())?;

    TG_PROCESSES.lock().map_err(|e| e.to_string())?.clear();
    Ok(ChromeResult {
        success: true,
        message: String::from("关闭所有Tg"),
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