use rusqlite::{params, Connection, Result};
use tauri::{Manager};
use std::error::Error;

pub fn init_db(app_handle: tauri::AppHandle){
    println!("Creating db");

    let path_resolver = app_handle.path();
    let data_path = path_resolver.app_local_data_dir().unwrap().join("chrome.db");

    print!("data_path: {:?}", data_path);
    match Connection::open(data_path){
        Ok(connection)=> {
            if let Err(err) = create_chrome(&connection){
                println!("无法创建chrome表: {}", err);
            }
        }
        Err(err)=>{
            println!("无法打开数据库连接: {}", err);
        }
    }
}

fn create_chrome(conn: &Connection)->Result<(), Box<dyn Error>>{
    let sql = "
        CREATE TABLE IF NOT EXISTS chrome (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50) NOT NULL,
            group_name VARCHAR(50),
            localtion VARCHAR(50),
            tags VARCHAR(200),
            open BOOLEAN DEFAULT FALSE,
            mark VARCHAR(200),
            last_open_time TIMESTAMP,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ";
    match conn.execute(sql, params![]) {
        Ok(rows)=>{
            println!("chrome表创建成功! , {}", rows);
            if let Err(err) = initialize_database(conn){
                println!("初始化数据失败: {}", err);
            }
        }
        Err(err)=>{
            println!("chrome表创建失败! , {}", err);
        }
    }
    Ok(())
}

fn initialize_database(conn: &Connection)->Result<(), Box<dyn Error>>{
    let insert_sql = "
        INSERT INTO chrome (name, group_name, localtion, tags, mark) VALUES
            ('eth-C871', '', '', '', ''),
            ('eth-bCb9', '', '', '', ''),
            ('eth-14AD', '', '', '', ''),
            ('eth-9f02', '', '', '', ''),
            ('eth-f9e7', '', '', '', ''),
            ('eth-8257', '', '', '', ''),
            ('eth-7084', '', '', '', ''),
            ('eth-702f', '', '', '', ''),
            ('eth-891b', '', '', '', ''),
            ('eth-a48e', '', '', '', ''),
            ('eth-f0C8', '', '', '', ''),
            ('eth-E696', '', '', '', ''),
            ('eth-cCDC', '', '', '', ''),
            ('eth-B9C6', '', '', '', ''),
            ('eth-1f0A', '', '', '', ''),
            ('eth-8dC7', '', '', '', ''),
            ('eth-4d64', '', '', '', ''),
            ('eth-32BE', '', '', '', ''),
            ('eth-FAf4', '', '', '', ''),
            ('eth-76DA', '', '', '', ''),
            ('eth-Ef65', '', '', '', ''),
            ('eth-451d', '', '', '', ''),
            ('eth-5fF4', '', '', '', ''),
            ('eth-5D48', '', '', '', ''),
            ('eth-3573', '', '', '', ''),
            ('eth-F994', '', '', '', ''),
            ('eth-661A', '', '', '', ''),
            ('eth-942b', '', '', '', ''),
            ('eth-1eD0', '', '', '', ''),
            ('eth-9955', '', '', '', ''),
            ('eth-0dd3', '', '', '', ''),
            ('eth-dcBe', '', '', '', ''),
            ('eth-a1Eb', '', '', '', ''),
            ('eth-1556', '', '', '', ''),
            ('eth-6dFb', '', '', '', ''),
            ('eth-7663', '', '', '', ''),
            ('eth-87Eb', '', '', '', ''),
            ('eth-21D7', '', '', '', ''),
            ('eth-CAA9', '', '', '', ''),
            ('eth-438b', '', '', '', ''),
            ('eth-e4F0', '', '', '', ''),
            ('eth-AeF5', '', '', '', ''),
            ('eth-4706', '', '', '', ''),
            ('eth-2bc2', '', '', '', ''),
            ('eth-49Fb', '', '', '', ''),
            ('eth-1fBb', '', '', '', ''),
            ('eth-68De', '', '', '', ''),
            ('eth-91a7', '', '', '', ''),
            ('eth-D029', '', '', '', ''),
            ('eth-Ca9F', '', '', '', ''),
            ('eth-C32E', '', '', '', ''),
            ('eth-58e0', '', '', '', ''),
            ('eth-ADdb', '', '', '', ''),
            ('eth-4b75', '', '', '', ''),
            ('eth-edC5', '', '', '', ''),
            ('eth-83A8', '', '', '', ''),
            ('eth-639b', '', '', '', ''),
            ('eth-0BF5', '', '', '', ''),
            ('eth-D196', '', '', '', ''),
            ('eth-de62', '', '', '', ''),
            ('eth-b561', '', '', '', ''),
            ('eth-F383', '', '', '', ''),
            ('eth-eFbC', '', '', '', ''),
            ('eth-A2BE', '', '', '', ''),
            ('eth-C84c', '', '', '', ''),
            ('eth-7225', '', '', '', ''),
            ('eth-4233', '', '', '', ''),
            ('eth-Ff96', '', '', '', ''),
            ('eth-203A', '', '', '', ''),
            ('eth-7550', '', '', '', ''),
            ('eth-4012', '', '', '', ''),
            ('eth-3bbF', '', '', '', ''),
            ('eth-3eCE', '', '', '', ''),
            ('eth-cF1b', '', '', '', ''),
            ('eth-bb3F', '', '', '', ''),
            ('eth-0d15', '', '', '', ''),
            ('eth-a178', '', '', '', ''),
            ('eth-b0d4', '', '', '', ''),
            ('eth-f549', '', '', '', ''),
            ('eth-827c', '', '', '', ''),
            ('eth-c3B8', '', '', '', ''),
            ('eth-8cf7', '', '', '', ''),
            ('eth-B6eC', '', '', '', ''),
            ('eth-9D68', '', '', '', ''),
            ('eth-1d70', '', '', '', ''),
            ('eth-29F5', '', '', '', ''),
            ('eth-3319', '', '', '', ''),
            ('eth-882B', '', '', '', ''),
            ('eth-c3B5', '', '', '', ''),
            ('eth-441A', '', '', '', ''),
            ('eth-210D', '', '', '', '');
    ";
    match conn.execute(insert_sql, params![]) {
        Ok(rows)=>{
            println!("初始数据：chrome 写入成功, {}", rows)
        }
        Err(err)=>{
            println!("初始数据写入失败：chrome, {}", err)
        }
    }
    Ok(())
}