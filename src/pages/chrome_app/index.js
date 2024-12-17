
import { useState } from 'react'
import { Avatar, Input, Form, Button,  Card, message, Row,Col } from 'antd'
import { SearchOutlined, } from '@ant-design/icons'
import './style.css';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event'
import app from './app'

const { Meta } = Card;

export default function Chrome() {
    const [form] = Form.useForm();
    const [data, setData] = useState(app);

    const installApp = async (id) => {
        const res = await invoke('install_chrome_extension', { extensionId:id });
        console.log(res);
    }

    const uninstallApp = async (id) => {
        const res = await invoke('uninstall_chrome_extension', { extensionId: id });
        console.log(res);
    }

    const handleSearch = (value) => {
        if (value.search) {
            setData(app.filter(item => item.name.includes(value.search)));
        } else {
            setData(app);
        }
    }

    return (
        <div style={{ height: '100%' }}>
            <div>
                <Form
                    form={form}
                    layout='inline'
                    onFinish={handleSearch}
                >
                    <Form.Item
                        name='search'
                    >
                        <Input size="large" max={20} onPressEnter={form.submit} placeholder="搜索名字" prefix={<SearchOutlined />} />
                    </Form.Item>
                </Form>
            </div>
            <div className='app-list'>
                <Row gutter={[16, 16]}>
                    {
                        data.map((item) => (
                            <Col span={8} key={item.id}>
                                <Card
                                    actions={[
                                        <Button danger onClick={() => uninstallApp(item.id)}>卸载</Button>,
                                        <Button type='primary' onClick={() => installApp(item.id)}>安装</Button>,
                                    ]}
                                >
                                    <Meta
                                        avatar={<Avatar src={item.icons} />}
                                        title={item.name}
                                        description={item.description}
                                    />
                                </Card>
                            </Col>
                        ))
                    }
                </Row>

            </div>
        </div>
    )
}


