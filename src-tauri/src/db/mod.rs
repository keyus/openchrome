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
            ('eth-C871', '', '', '', '','113.0.5672'),
            ('eth-bCb9', '', '', '', '','114.0.5735'),
            ('eth-14AD', '', '', '', '','115.0.5790'),
            ('eth-9f02', '', '', '', '','116.0.5845'),
            ('eth-f9e7', '', '', '', '','117.0.5938'),
            ('eth-8257', '', '', '', '','118.0.5993'),
            ('eth-7084', '', '', '', '','119.0.6045'),
            ('eth-702f', '', '', '', '','120.0.6099'),
            ('eth-891b', '', '', '', '','121.0.6167'),
            ('eth-a48e', '', '', '', '','135.0.7023.0'),
            ('eth-f0C8', '', '', '', '','134.0.6998.23'),
            ('eth-E696', '', '', '', '','132.0.6834.209'),
            ('eth-cCDC', '', '', '', '','133.0.6943.126'),
            ('eth-B9C6', '', '', '', '','135.0.7012.4'),
            ('eth-1f0A', '', '', '', '','134.0.6998.15'),
            ('eth-8dC7', '', '', '', '','132.0.6834.207'),
            ('eth-4d64', '', '', '', '','133.0.6943.98'),
            ('eth-32BE', '', '', '', '','135.0.6999.2'),
            ('eth-FAf4', '', '', '', '','134.0.6998.3'),
            ('eth-76DA', '', '', '', '','132.0.6834.194'),
            ('eth-Ef65', '', '', '', '','133.0.6943.127'),
            ('eth-451d', '', '', '', '','133.0.6943.99'),
            ('eth-5fF4', '', '', '', '','133.0.6943.60'),
            ('eth-5D48', '', '', '', '','132.0.6834.160'),
            ('eth-3573', '', '', '', '','132.0.6834.111'),
            ('eth-F994', '', '', '', '','131.0.6778.265'),
            ('eth-661A', '', '', '', '','131.0.6778.140'),
            ('eth-942b', '', '', '', '','131.0.6778.86'),
            ('eth-1eD0', '', '', '', '','130.0.6778.70'),
            ('eth-9955', '', '', '', '','130.0.6723.117'),
            ('eth-0dd3', '', '', '', '','130.0.6723.70'),
            ('eth-dcBe', '', '', '', '','129.0.6668.101'),
            ('eth-a1Eb', '', '', '', '','129.0.6668.90'),
            ('eth-1556', '', '', '', '','129.0.6668.59'),
            ('eth-6dFb', '', '', '', '','128.0.6613.138'),
            ('eth-7663', '', '', '', '','128.0.6613.120'),
            ('eth-87Eb', '', '', '', '','128.0.6613.85'),
            ('eth-21D7', '', '', '', '','127.0.6533.120'),
            ('eth-CAA9', '', '', '', '','127.0.6533.100'),
            ('eth-438b', '', '', '', '','127.0.6533.89'),
            ('eth-e4F0', '', '', '', '','127.0.6533.73'),
            ('eth-AeF5', '', '', '', '','126.0.6478.183'),
            ('eth-4706', '', '', '', '','128.0.6537.0'),
            ('eth-2bc2', '', '', '', '','126.0.6478.115'),
            ('eth-49Fb', '', '', '', '','126.0.6478.62'),
            ('eth-1fBb', '', '', '', '','126.0.6478.57'),
            ('eth-68De', '', '', '', '','125.0.6422.142'),
            ('eth-91a7', '', '', '', '','125.0.6422.77'),
            ('eth-D029', '', '', '', '','124.0.6367.207'),
            ('eth-Ca9F', '', '', '', '','124.0.6367.119'),
            ('eth-C32E', '', '', '', '','124.0.6367.92'),
            ('eth-58e0', '', '', '', '','124.0.6367.61'),
            ('eth-ADdb', '', '', '', '','123.0.6312.123'),
            ('eth-4b75', '', '', '', '','123.0.6312.106'),
            ('eth-edC5', '', '', '', '','123.0.6312.86'),
            ('eth-83A8', '', '', '', '','123.0.6312.59'),
            ('eth-639b', '', '', '', '','122.0.6261.129'),
            ('eth-0BF5', '', '', '', '','122.0.6261.112'),
            ('eth-D196', '', '', '', '','122.0.6261.95'),
            ('eth-de62', '', '', '', '','121.0.6167.184'),
            ('eth-b561', '', '', '', '','121.0.6167.161'),
            ('eth-F383', '', '', '', '','120.0.6099.225'),
            ('eth-eFbC', '', '', '', '','120.0.6099.217'),
            ('eth-A2BE', '', '', '', '','120.0.6099.199'),
            ('eth-C84c', '', '', '', '','120.0.6099.109'),
            ('eth-7225', '', '', '', '','120.0.6099.71'),
            ('eth-4233', '', '', '', '','119.0.6045.200'),
            ('eth-Ff96', '', '', '', '','119.0.6045.160'),
            ('eth-203A', '', '', '', '','119.0.6045.124'),
            ('eth-7550', '', '', '', '','119.0.6045.105'),
            ('eth-4012', '', '', '', '','118.0.5993.118'),
            ('eth-3bbF', '', '', '', '','118.0.5993.96'),
            ('eth-3eCE', '', '', '', '','118.0.5993.71'),
            ('eth-cF1b', '', '', '', '','117.0.5938.150'),
            ('eth-bb3F', '', '', '', '','117.0.5938.92'),
            ('eth-0d15', '', '', '', '','117.0.5938.89'),
            ('eth-a178', '', '', '', '','117.0.5938.63'),
            ('eth-b0d4', '', '', '', '','116.0.5845.188'),
            ('eth-f549', '', '', '', '','116.0.5845.141'),
            ('eth-827c', '', '', '', '','116.0.5845.97'),
            ('eth-c3B8', '', '', '', '','115.0.5790.110'),
            ('eth-8cf7', '', '', '', '','115.0.5790.102'),
            ('eth-B6eC', '', '', '', '','115.0.5790.99'),
            ('eth-9D68', '', '', '', '','114.0.5735.199'),
            ('eth-1d70', '', '', '', '','114.0.5735.134'),
            ('eth-29F5', '', '', '', '','114.0.5735.106'),
            ('eth-3319', '', '', '', '','113.0.5672.127'),
            ('eth-882B', '', '', '', '','113.0.5672.92'),
            ('eth-c3B5', '', '', '', '','113.0.5672.93'),
            ('eth-441A', '', '', '', '','112.0.5615.138'),
            ('eth-210D', '', '', '', '','112.0.5615.87');
    ";
