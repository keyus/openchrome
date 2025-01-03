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

#[derive(Serialize)]
pub struct ChromeResult {
    success: bool,
    message: String,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct OpenInstance {
    name: String,
    version: String,
}

fn get_user_agent(version: &str) -> String {
    let user_agent = format!(
        "ozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/{} Safari/537.36",
        version
    );
    user_agent
}

#[tauri::command]
// 打开chrome 指定 user-data-dir
// ozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
pub fn open_chrome(names: Vec<OpenInstance>) -> Result<ChromeResult, String> {
    let chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe";

    println!("open_chrome: {:?}", names);
    for item in names {
        let user_agent = get_user_agent(&item.version);
        println!("{} : user_agent: {}", item.name, user_agent);
        // 使用explorer打开Chrome
        let child = Command::new(chrome_path)
            .arg(format!("--user-data-dir=D:\\chrome100 app\\{}", item.name))
            //加载扩展
            // .arg("--load-extension=D:\\tools\\openchrome\\proxy\\")
            .arg(format!("--user-agent={}",user_agent))
            //指定代理服务器
            // .arg("--proxy-server=http://198.23.239.134:6540")
            // 启动url
            // .arg("http://your-startup-url.com?param1=value1&param2=value2")
            .spawn()
            .map_err(|e| e.to_string())?;
        let pid = child.id();

        CHROME_PROCESSES
            .lock()
            .map_err(|e| e.to_string())?
            .insert(item.name.clone(), pid);
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

// 杀死指定pid的进程
fn kill_process_by_pid(pid: u32) -> Result<(), String> {
    let sys = System::new_all();
    if let Some(process) = sys.process(Pid::from(pid as usize)) {
        process.kill();
    }
    Ok(())
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
