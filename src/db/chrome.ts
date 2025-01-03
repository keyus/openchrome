import Database from '@tauri-apps/plugin-sql';
// import { appDataDir } from '@tauri-apps/api/path'

//C:\Users\kissw\AppData\Roaming\com.test-rs.app
// const m = await appDataDir();
// console.log('appDataDir',m)
export default {
    async connect() {
        return await Database.load('sqlite:inwen.db')
    },

    async create() {
        const db = await this.connect();
        await db.execute(`
            CREATE TABLE IF NOT EXISTS chrome (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) NOT NULL,
                group_name VARCHAR(50),
                localtion VARCHAR(50),
                tags VARCHAR(200),
                open BOOLEAN DEFAULT FALSE,
                mark VARCHAR(200),
                version VARCHAR(50),
                last_open_time TIMESTAMP,
                create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        return db;
    },
    async initInsert() {
        const db = await this.create();
        const result = await db.select(`select count(id) as count from chrome`);
        const count = result.at(0).count;
        if (count !== 0) return db.close();
        await db.execute(`
            INSERT INTO chrome (name, group_name, localtion, tags, mark, version) VALUES
            ('eth-C871', '', '', '', '', '131.0.6778.241'),
            ('eth-bCb9', '', '', '', '', '133.0.6905.0'),
            ('eth-14AD', '', '', '', '', '133.0.6903.3'),
            ('eth-9f02', '', '', '', '', '132.0.6834.57'),
            ('eth-f9e7', '', '', '', '', '130.0.6723.170'),
            ('eth-8257', '', '', '', '', '131.0.6778.200'),
            ('eth-7084', '', '', '', '', '131.0.6778.204'),
            ('eth-702f', '', '', '', '', '131.0.6778.205'),
            ('eth-891b', '', '', '', '', '132.0.6834.56'),
            ('eth-a48e', '', '', '', '', '132.0.6834.54'),
            ('eth-f0C8', '', '', '', '', '131.0.6778.154'),
            ('eth-E696', '', '', '', '', '126.0.6478.260'),
            ('eth-cCDC', '', '', '', '', '133.0.6889.2'),
            ('eth-B9C6', '', '', '', '', '133.0.6888.2'),
            ('eth-1f0A', '', '', '', '', '131.0.6778.96'),
            ('eth-8dC7', '', '', '', '', '132.0.6834.46'),
            ('eth-4d64', '', '', '', '', '132.0.6834.44'),
            ('eth-32BE', '', '', '', '', '132.0.6834.43'),
            ('eth-FAf4', '', '', '', '', '131.0.6778.135'),
            ('eth-76DA', '', '', '', '', '130.0.6723.160'),
            ('eth-Ef65', '', '', '', '', '131.0.6778.139'),
            ('eth-451d', '', '', '', '', '131.0.6778.140'),
            ('eth-5fF4', '', '', '', '', '132.0.6834.39'),
            ('eth-5D48', '', '', '', '', '131.0.6778.134'),
            ('eth-3573', '', '', '', '', '132.0.6834.31'),
            ('eth-F994', '', '', '', '', '131.0.6778.103'),
            ('eth-661A', '', '', '', '', '133.0.6876.3'),
            ('eth-942b', '', '', '', '', '133.0.6876.4'),
            ('eth-1eD0', '', '', '', '', '132.0.6834.31'),
            ('eth-9955', '', '', '', '', '131.0.6778.103'),
            ('eth-0dd3', '', '', '', '', '132.0.6834.32'),
            ('eth-dcBe', '', '', '', '', '132.0.6834.33'),
            ('eth-a1Eb', '', '', '', '', '131.0.6778.104'),
            ('eth-1556', '', '', '', '', '131.0.6778.103'),
            ('eth-6dFb', '', '', '', '', '131.0.6778.108'),
            ('eth-7663', '', '', '', '', '131.0.6778.109'),
            ('eth-87Eb', '', '', '', '', '130.0.6723.15'),
            ('eth-21D7', '', '', '', '', '126.0.6478.258'),
            ('eth-CAA9', '', '', '', '', '133.0.6847.2'),
            ('eth-438b', '', '', '', '', '133.0.6848.2'),
            ('eth-e4F0', '', '', '', '', '132.0.6834.15'),
            ('eth-AeF5', '', '', '', '', '130.0.6723.137'),
            ('eth-4706', '', '', '', '', '132.0.6834.14'),
            ('eth-2bc2', '', '', '', '', '132.0.6834.14'),
            ('eth-49Fb', '', '', '', '', '131.0.6778.81'),
            ('eth-1fBb', '', '', '', '', '131.0.6778.85'),
            ('eth-68De', '', '', '', '', '131.0.6778.86'),
            ('eth-91a7', '', '', '', '', '131.0.6778.75'),
            ('eth-D029', '', '', '', '', '133.0.6835.3'),
            ('eth-Ca9F', '', '', '', '', '132.0.6834.5'),
            ('eth-C32E', '', '', '', '', '133.0.6835.0'),
            ('eth-58e0', '', '', '', '', '132.0.6834.0'),
            ('eth-ADdb', '', '', '', '', '132.0.6834.6'),
            ('eth-4b75', '', '', '', '', '132.0.6834.4'),
            ('eth-edC5', '', '', '', '', '131.0.6778.39'),
            ('eth-83A8', '', '', '', '', '131.0.6778.69'),
            ('eth-639b', '', '', '', '', '131.0.6778.70'),
            ('eth-0BF5', '', '', '', '', '130.0.6723.126'),
            ('eth-D196', '', '', '', '', '130.0.6723.127'),
            ('eth-de62', '', '', '', '', '131.0.6778.73'),
            ('eth-b561', '', '', '', '', '126.0.6478.257'),
            ('eth-F383', '', '', '', '', '132.0.6821.2'),
            ('eth-eFbC', '', '', '', '', '132.0.6822.0'),
            ('eth-A2BE', '', '', '', '', '131.0.6778.39'),
            ('eth-C84c', '', '', '', '', '131.0.6778.29'),
            ('eth-7225', '', '', '', '', '131.0.6778.39'),
            ('eth-4233', '', '', '', '', '131.0.6778.33'),
            ('eth-Ff96', '', '', '', '', '131.0.6778.31'),
            ('eth-203A', '', '', '', '', '131.0.6778.33'),
            ('eth-7550', '', '', '', '', '131.0.6778.32'),
            ('eth-4012', '', '', '', '', '130.0.6723.101'),
            ('eth-3bbF', '', '', '', '', '130.0.6723.102'),
            ('eth-3eCE', '', '', '', '', '130.0.6723.116'),
            ('eth-cF1b', '', '', '', '', '130.0.6723.117'),
            ('eth-bb3F', '', '', '', '', '132.0.6811.2'),
            ('eth-0d15', '', '', '', '', '132.0.6808.3'),
            ('eth-a178', '', '', '', '', '131.0.6778.22'),
            ('eth-b0d4', '', '', '', '', '131.0.6778.24'),
            ('eth-f549', '', '', '', '', '131.0.6778.17'),
            ('eth-827c', '', '', '', '', '130.0.6723.84'),
            ('eth-c3B8', '', '', '', '', '130.0.6723.86'),
            ('eth-8cf7', '', '', '', '', '130.0.6723.90'),
            ('eth-B6eC', '', '', '', '', '130.0.6723.91'),
            ('eth-9D68', '', '', '', '', '130.0.6723.92'),
            ('eth-1d70', '', '', '', '', '132.0.6793.2'),
            ('eth-29F5', '', '', '', '', '132.0.6793.3'),
            ('eth-3319', '', '', '', '', '130.0.6723.79'),
            ('eth-882B', '', '', '', '', '131.0.6778.13'),
            ('eth-c3B5', '', '', '', '', '131.0.6778.12'),
            ('eth-441A', '', '', '', '', '130.0.6723.69'),
            ('eth-210D', '', '', '', '', '130.0.6723.70');
    `);
    },
    async getAll() {
        const db = await this.connect();
        return db.select('select id, name, group_name, localtion, tags, mark, version, last_open_time from chrome');
    },
    async update_last_open_time(values) {
        const db = await this.connect();
        console.log('va', values)
        if (Array.isArray(values)) {
            if (values.length === 0) return;

            values.forEach((it) => {
                const { last_open_time, name } = it;
                console.log('update value', last_open_time, name)
                db.execute(`update chrome set last_open_time = $1 where name = $2 `, [
                    last_open_time, name
                ]).then(result => {
                    console.log('result', result)
                })
            })
            return
        }
        const { last_open_time, name } = values;
        return db.execute(`update chrome set last_open_time = ? where name = ? `, [
            last_open_time, name
        ])
    },
}
