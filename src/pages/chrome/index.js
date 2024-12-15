
import { useState } from 'react'
import { Input, Form, Select, Checkbox, Button, Space, Table, message } from 'antd'
import { useMount, useUpdateEffect } from 'ahooks'
import { SearchOutlined, PlayCircleOutlined, CloseCircleOutlined, PoweroffOutlined, ReloadOutlined, } from '@ant-design/icons'
import './style.css';
import columns from './columns';
import { list } from '../../config'
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event'

export default function Chrome() {
    const [form] = Form.useForm();
    const open = Form.useWatch('open', form);
    const [data, setData] = useState(list)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 7,
        total: list.length,
    })

    useUpdateEffect(() => {
        if (open) {
            setData(data.filter(it => it.open))
        } else {
            setData(list)
        }
    }, [open])

    useMount(() => {
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

    const onOpen = async (items) => {
        const names = items.map(it => it.title);
        const res = await invoke('open_chrome', { names })
        if (res.success) {
            setData(data.map(it => {
                if (names.includes(it.title)) {
                    return { ...it, open: true }
                }
                return it
            }))
        } else {
            message.error("打开失败")
        }
        console.log(res)
    }
    const onClose = async (items) => {
        const names = items.map(it => it.title);
        invoke('close_chrome', { names })
        setData(data.map(it => {
            if (names.includes(it.title)) {
                return { ...it, open: false }
            }
            return it
        }))
    }
    const onCloseAll = () => {
        invoke('close_all_chrome');
        setData(data.map(it => {
            return { ...it, open: false }
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
                        <Button
                            type='primary'
                            icon={<PlayCircleOutlined />}
                            size='large'
                            autoInsertSpace={false}
                            onClick={() => {
                                onOpen(selectedRows);
                                setSelectedRowKeys([]);
                                setSelectedRows([]);
                            }}
                            disabled={selectedRowKeys.length === 0}
                        >打开</Button>
                        <Button
                            icon={<CloseCircleOutlined />}
                            onClick={() => {
                                onClose(selectedRows);
                                setSelectedRowKeys([]);
                                setSelectedRows([]);
                            }}
                            disabled={selectedRowKeys.length === 0}
                            size='large' />
                        <Button
                            icon={<PoweroffOutlined />}
                            size='large'
                            onClick={onCloseAll}
                        >
                            一键关闭
                        </Button>
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
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys)
                            setSelectedRows(selectedRows)
                        }
                    }}
                    locale={{ emptyText: '暂无数据' }}
                    rowKey='title'
                    columns={column}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 7, 10],
                        total: pagination.total,
                    }}
                    onChange={onChange}
                    dataSource={data}
                />
            </div>
        </div>
    )
}


