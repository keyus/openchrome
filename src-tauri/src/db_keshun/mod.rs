use rusqlite::{params, Connection, Result};
use tauri::Manager;

pub fn init_db(app_handle: tauri::AppHandle) {
    let path_resolver = app_handle.path();
    let data_path = path_resolver.app_data_dir().unwrap().join("chrome.db");

    print!("data_path: {:?} \n", data_path);
    match Connection::open(data_path) {
        Ok(connection) => {
            println!("连接数据库成功!");
            table_exists(&connection, "chrome");
            create_table(&connection);
        }
        Err(err) => {
            println!("无法打开数据库连接: {}", err);
        }
    }
}

fn create_table(conn: &Connection) {
    //创建chrome表
    if !table_exists(&conn, "chrome") {
        match conn.execute(&CREATE_CHROME_SQL, params![]) {
            Ok(rows) => {
                println!("chrome表创建成功! , {}", rows);
                match conn.execute(&INSERT_CHROME_SQL, params![]) {
                    Ok(rows) => {
                        println!("chrome表初始化成功, {}", rows)
                    }
                    Err(err) => {
                        println!("chrome初始化失败! {}", err)
                    }
                }
            }
            Err(_) => {
                //已存在chrome
                println!("chrome表，已存在!");
            }
        }
    }

    if !table_exists(&conn, "version") {
        //创建version表
        match conn.execute(&CREATE_VERSION_SQL, params![]) {
            Ok(rows) => {
                println!("version表创建成功! , {}", rows);
                match conn.execute(&INSERT_VERSION_SQL, params![]) {
                    Ok(rows) => {
                        println!("version表初始化成功! , {}", rows);
                    }
                    Err(_) => {
                        println!("version 已存在!");
                    }
                }
            }
            Err(_) => {
                //已存在version
                println!("version表，已存在!");
            }
        }
    }
}

fn table_exists(conn: &Connection, table_name: &str) -> bool {
    let sql = "SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name=?)";
    let row = conn.query_row(&sql, [table_name], |row| row.get::<_, u32>(0));

    let result = match row {
        Ok(row) => row > 0,
        Err(_) => false,
    };
    result
}

const CREATE_VERSION_SQL: &str = "
        CREATE TABLE IF NOT EXISTS version (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            version VARCHAR(50) NOT NULL,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ";
const CREATE_CHROME_SQL: &str = "
        CREATE TABLE IF NOT EXISTS chrome (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50) NOT NULL,
            group_name VARCHAR(50),
            localtion VARCHAR(50),
            tags VARCHAR(200),
            openChrome BOOLEAN DEFAULT FALSE,
            openTg BOOLEAN DEFAULT FALSE,
            mark VARCHAR(200),
            chrome_version VARCHAR(50),
            last_open_time TIMESTAMP,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ";

const INSERT_VERSION_SQL: &str = "INSERT INTO version (version) VALUES ('1')";
 
const INSERT_CHROME_SQL: &str = "
        INSERT INTO chrome (name, group_name, localtion, tags, mark,chrome_version) VALUES
        ('eth-c42a', '', '', '', '','113.0.5672'),
        ('eth-c666', '', '', '', '','113.0.5672'),
        ('eth-0521', '', '', '', '','113.0.5672'),
        ('eth-82ce', '', '', '', '','113.0.5672'),
        ('eth-6F62', '', '', '', '','113.0.5672'),
        ('eth-8257', '', '', '', '','113.0.5672'),
        ('eth-b405', '', '', '', '','113.0.5672'),
        ('eth-28BC', '', '', '', '','113.0.5672'),
        ('eth-a335', '', '', '', '','113.0.5672'),
        ('eth-60DA', '', '', '', '','113.0.5672'),
        ('eth-4Fd1', '', '', '', '','113.0.5672'),
        ('eth-43BF', '', '', '', '','113.0.5672'),
        ('eth-b83a', '', '', '', '','113.0.5672'),
        ('eth-ef88', '', '', '', '','113.0.5672'),
        ('eth-8514', '', '', '', '','113.0.5672'),
        ('eth-38E8', '', '', '', '','113.0.5672'),
        ('eth-9c8A', '', '', '', '','113.0.5672'),
        ('eth-2fb5', '', '', '', '','113.0.5672'),
        ('eth-d527', '', '', '', '','113.0.5672'),
        ('eth-0cE3', '', '', '', '','113.0.5672'),
        ('eth-Fe62', '', '', '', '','113.0.5672'),
        ('eth-Aa03', '', '', '', '','113.0.5672'),
        ('eth-8b1A', '', '', '', '','113.0.5672'),
        ('eth-11e0', '', '', '', '','113.0.5672'),
        ('eth-2a97', '', '', '', '','113.0.5672'),
        ('eth-38d6', '', '', '', '','113.0.5672'),
        ('eth-9334', '', '', '', '','113.0.5672'),
        ('eth-910a', '', '', '', '','113.0.5672'),
        ('eth-ef02', '', '', '', '','113.0.5672'),
        ('eth-F0dd', '', '', '', '','113.0.5672'),
        ('eth-929e', '', '', '', '','113.0.5672');
    ";
