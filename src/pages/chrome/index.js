
import { Tag, Form, Select, Divider, Popover, Badge } from 'antd'
import { listUp, listDown } from '../../config';
import { invoke } from '@tauri-apps/api/core'

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import './style.css';
import { logger } from '@rsbuild/core';


function group(list, lens = 7) {
    let groupNum = 0;
    let arr = [];
    const data = Object.groupBy(list, (item) => {
        const key = item.at(0);
        if (arr.indexOf(key) === -1) {
            arr.push(key);
        }
        if (arr.length === lens) {
            groupNum++;
            arr = [];
        }
        return groupNum;
    });
    return Object.entries(data);
}


export default function Chrome() {
    const [form] = Form.useForm();
    const groupNum = Form.useWatch('groupNum', form);
    const listUpGroups = group(listUp, groupNum);
    const listDownGroups = group(listDown, groupNum);

    return (
        <div>
            <h1>Chrome 启动 <span>（每{groupNum}个为一组）</span></h1>
            <Form
                form={form}
                initialValues={{
                    groupNum: 7
                }}
            >
                <Form.Item
                    label='分组数量'
                    name='groupNum'
                >
                    <Select
                        style={{ width: 70 }}
                        options={[
                            { label: '4', value: 4 },
                            { label: '5', value: 5 },
                            { label: '6', value: 6 },
                            { label: '7', value: 7 },
                            { label: '8', value: 8 },
                            { label: '9', value: 9 },
                        ]}
                    />
                </Form.Item>
            </Form>
            <div className='chrome-group'>
                <div className='item'>
                    <h2>上方</h2>
                    <ul className='ul-group'>
                        {
                            listUpGroups.map((item) => {
                                const key = item.at(0);
                                return (
                                    <ItemData key={key} data={item} />
                                )
                            })
                        }
                    </ul>
                </div>

                <Divider>58e0</Divider>

                <div className='item'>
                    <h2>下方</h2>
                    <ul className='ul-group'>
                        {
                            listDownGroups.map((item) => {
                                const key = item.at(0);
                                return (
                                    <ItemData key={key} data={item} />
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

function ItemData(props = {}) {
    const { data } = props;
    const num = data.at(0);
    const list = data.at(1);
    const title = `chrome 组${Number(num) + 1}`
    const openChrome = async () => {
        const sets = list.map((item) => item.at(1));
        console.log('通知rust');

        const res = await invoke('open_chrome', { path: 'kd' }).catch(e=>{});
        console.log('res', res);
    }

    return (
        <li >
            <Popover
                title={title}
                trigger={['click']}
                content={
                    <div>
                        {
                            list.map((item) => {
                                const [key, value] = item;
                                return (
                                    <p
                                        key={key}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <Badge
                                            color="#faad14"
                                            count={key} />
                                        <span>{value}</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                }>
                <Tag
                    // icon={<SyncOutlined spin />}
                    bordered={false}
                // color='processing'
                >chrome{+num + 1}</Tag>
            </Popover>
            <Tag
                onClick={openChrome}
            >启动</Tag>
        </li>
    )
}