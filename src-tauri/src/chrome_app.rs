use winreg::enums::*;
use winreg::RegKey;

#[tauri::command]
pub fn install_chrome_extension(extension_id: &str) -> Result<(), String> {
    // 检查系统架构并选择正确的注册表路径
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let extensions_path = if cfg!(target_arch = "x86_64") {
        r"Software\Wow6432Node\Google\Chrome\Extensions"
    } else {
        r"Software\Google\Chrome\Extensions"
    };

    println!("extension_id: {}", extension_id);
    println!("extensions_path: {}", extensions_path);
    // 创建或打开 Extensions 键
    let (extensions_key, _) = hklm.create_subkey(extensions_path)
        .map_err(|e| {
            println!("faild {:?}", e);
            format!("Failed to create Extensions key: {}", e)
        })?;
    println!("extensions_key: {:?}", extensions_key);
    // 为扩展创建子键
    let (ext_key, _) = extensions_key.create_subkey(extension_id)
        .map_err(|e| format!("Failed to create extension key: {}", e))?;

    println!("ext_key: {:?}", ext_key);
    // 设置 update_url
    ext_key.set_value("update_url", &"https://clients2.google.com/service/update2/crx")
        .map_err(|e| format!("Failed to set update_url: {}", e))?;
    println!("set update_url success");
    Ok(())
}

// 清理扩展注册表项的函数
#[tauri::command]
pub fn uninstall_chrome_extension(extension_id: &str) -> Result<(), String> {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let extensions_path = if cfg!(target_arch = "x86_64") {
        r"Software\Wow6432Node\Google\Chrome\Extensions"
    } else {
        r"Software\Google\Chrome\Extensions"
    };

    if let Ok(extensions_key) = hklm.open_subkey(extensions_path) {
        // 尝试删除扩展键
        if let Err(e) = extensions_key.delete_subkey(extension_id) {
            return Err(format!("Failed to remove extension: {}", e));
        }
    }

    Ok(())
}

