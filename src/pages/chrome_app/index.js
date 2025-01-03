
import { useState } from 'react'
import { Avatar, Input, Form, Button, Card, message, Row, Col, Tooltip } from 'antd'
import { SearchOutlined, } from '@ant-design/icons'
import './style.css';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import app from './app'
import { useUpdateEffect } from 'ahooks';

const { Meta } = Card;

export default function Chrome() {
    const [form] = Form.useForm();
    const search = Form.useWatch('search', form);
    const [data, setData] = useState(app);

    const installApp = async (id) => {
        try {
            await invoke('install_chrome_extension', { extensionId: id });
            message.success("安装成功");
        } catch (e) {
            message.error(e);
        }
    }

    const uninstallApp = async (id) => {
        try {
            await invoke('uninstall_chrome_extension', { extensionId: id });
            message.success("卸载成功");
        } catch (e) {
            message.error(e);
        }
    }

    const handleSearch = (value) => {
        if (value.search) {
            setData(app.filter(item => item.name.includes(value.search)));
        } else {
            setData(app);
        }
    }

    useUpdateEffect(()=>{
        if (search) {
            setData(app.filter(item => item.name.toLowerCase().includes(search.toLowerCase())));
        } else {
            setData(app);
        }
    },[search])

    const openUrl = (url) => () => {
        open(url);
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
                                        <Button type='primary' onClick={() => installApp(item.id)}>全局安装</Button>,
                                    ]}
                                >
                                    <Meta
                                        avatar={<Tooltip title='去chrome商店下载'><a onClick={openUrl(item.url)}><Avatar src={item.icons} /></a></Tooltip>}
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


