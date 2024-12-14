
import { useState } from 'react'
import { Input, Form, Select, Checkbox, Button, Space, Table, message } from 'antd'
import { useMount, useUpdateEffect } from 'ahooks'
import { SearchOutlined, PlayCircleOutlined, CloseCircleOutlined, DeleteOutlined, ReloadOutlined, } from '@ant-design/icons'
import './style.css';
import columns from './columns';
import { list } from '../../config'
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event'

export default function Chrome() {
    const [form] = Form.useForm();
    const open = Form.useWatch('open', form);
    const [data, setData] = useState(list)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: list.length,
    })

    useUpdateEffect(() => {
        if (open) {
            setData(data.filter(it => it.open))
        } else {
            setData(list)
        }
    }, [open])

    useMount(()=>{
        listen('chrome-closed', (e) => {
            console.log('chrome-closed', e)
            setData(data.map(it => {
                if (it.title === e.payload) {
                    return { ...it, open: false }
                }
                return it
            }))
        })
    })

    const onChange = (pagination, filters, sorter, extra) => {
        setPagination(pagination)
    }
    const onFinish = (values) => {
        console.log(values)
        if (values.search) {
            return setData(list.filter(it => {
                return it.title.toLowerCase().includes(values.search.toLowerCase())
            }))
        }
        return setData(list)
    }

    const onOpen = async (item) => {
        const res = await invoke('open_chrome', { name: item.title })
        if (res.success) {
            setData(data.map(it => {
                if (it.title === item.title) {
                    return { ...it, open: true }
                }
                return it
            }))
        } else {
            message.error("打开失败")
        }
        console.log(res)
    }
    const onClose = async (item) => {
        invoke('close_chrome', { name: item.title })
        setData(data.map(it => {
            if (it.title === item.title) {
                return { ...it, open: false }
            }
            return it
        }))
    }
    const column = columns({ onOpen, onClose });
    const x = column.reduce((a, b) => { return a + b.width }, 0)

    return (
        <div style={{ height: '100%' }}>
            <div>
                <Form
                    form={form}
                    layout='inline'
                    initialValues={{
                        group: '',
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='group'
                    >
                        <Select
                            style={{ width: 150 }}
                            size="large"
                            options={[
                                { label: '全部分组', value: '' },
                                { label: 'eth', value: 1 },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name='search'
                    >
                        <Input size="large" max={20} onPressEnter={form.submit} placeholder="搜索名字" prefix={<SearchOutlined />} />
                    </Form.Item>
                    <Form.Item
                        name='open'
                        valuePropName='checked'
                        className='flex-center'
                    >
                        <Checkbox size="large">已打开(0)</Checkbox>
                    </Form.Item>
                </Form>
            </div>
            <div className='tools'>
                <div>
                    <Space>
                        <Button type='primary' icon={<PlayCircleOutlined />} size='large' autoInsertSpace={false}>打开</Button>
                        <Button icon={<CloseCircleOutlined />} size='large' />
                        <Button icon={<DeleteOutlined />} disabled size='large' />
                    </Space>
                </div>
                <div>
                    <Space>
                        <Button icon={<ReloadOutlined />} disabled size='large' />
                    </Space>
                </div>
            </div>
            <div className='list-table'>
                <Table
                    scroll={{ y: 480, x }}
                    rowSelection={{
                        fixed: true,
                    }}
                    rowKey='title'
                    columns={column}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
                        total: pagination.total,
                    }}
                    onChange={onChange}
                    dataSource={data}
                />
            </div>
        </div>
    )
}


