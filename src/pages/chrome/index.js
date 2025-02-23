
import { use, useState, version } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Input, Form, Select, Checkbox, Button, Space, Table, message, Tooltip } from 'antd'
import { useMount, useUpdateEffect } from 'ahooks'
import { ReactComponent as Chromeicon } from '../../assets/chrome.svg'
import { ReactComponent as Tgicon } from '../../assets/telegram.svg'
import { SearchOutlined, PlayCircleOutlined, CloseCircleOutlined, PoweroffOutlined, ReloadOutlined, } from '@ant-design/icons'
import { invoke } from '@tauri-apps/api/core';
import { listen, } from '@tauri-apps/api/event'
import columns from './columns';
import db from '../../db/chrome'
import './style.css';


export async function clientLoader() {
    return db.getAll();
}

export default function Chrome(props = {}) {
    const dataOrg = useLoaderData();
    const [form] = Form.useForm();
    const open = Form.useWatch('open', form);
    const search = Form.useWatch('search', form);
    const [data, setData] = useState(dataOrg)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 7,
        total: dataOrg.length,
    })

    useUpdateEffect(() => {
        if (open) {
            setData(data => {
                return data.filter(it => it.openChrome || it.openTg)
            })
        } else {
            setData(dataOrg)
        }
    }, [open]);

    useUpdateEffect(() => {
        if (search) {
            return setData(dataOrg.filter(it => {
                return it.name.toLowerCase().includes(search.toLowerCase())
            }))
        } else {
            setData(dataOrg)
        }
    }, [search])

    useMount(() => {
        let unlisten = null;
        listen('chrome-closed', (e) => {
            console.log('chrome-closed', e)
            setData((prev) => {
                return prev.map(it => {
                    if (e.payload.length > 0 && e.payload.includes(it.name)) {
                        return { ...it, openChrome: false }
                    }
                    return it
                });
            })
        }).then(unlisten => {
            unlisten = unlisten;
        })
        return () => {
            unlisten?.();
        };
    })

    const onChange = (pagination, filters, sorter, extra) => {
        setPagination(pagination)
    }

    /**
     * 
     * @param {Array} items 
     * @param {boolean} useVersion 
     */
    const onOpen = async (items, useVersion = false) => {
        const options = items.map(it => {
            if (useVersion) {
                return { name: it.name, chrome_version: it.chrome_version }
            } else {
                return { name: it.name }
            }
        });

        console.log('options', options);
        
        const arr = items.map(it => it.name)
        const res = await invoke('open_chrome', { options });


        const last_open_time = Date.now();
        if (res.success) {
            db.update_last_open_time(items.map(it => ({
                name: it.name,
                last_open_time,
            })));
            console.log('open success')
            setData((data) => {
                return data.map(it => {
                    if (arr.includes(it.name)) {
                        return { ...it, openChrome: true, last_open_time, }
                    }
                    return it
                })
            })
        } else {
            message.error("打开失败")
        }
    }
    const onClose = async (items) => {
        const names = items.map(it => it.name);
        invoke('close_chrome', { names })
        setData((data) => {
            return data.map(it => {
                if (names.includes(it.name)) {
                    return { ...it, openChrome: false }
                }
                return it
            })
        })
    }
    const onCloseAll = () => {
        invoke('close_all_chrome');
        setData((data) => {
            return data.map(it => {
                return { ...it, openChrome: false }
            })
        })
        message.success('已关闭所有chrome窗口')
    }

    const openTelegram = async (items) => {
        const names = items.map(it => it.name);
        const res = await invoke('open_tg', { names });
        if (res.success) {
            console.log('open success')
            setData((data) => {
                return data.map(it => {
                    if (names.includes(it.name)) {
                        return { ...it, openTg: true, }
                    }
                    return it
                })
            })
        } else {
            message.error("打开失败")
        }
    }
    const onCloseTg = async (items) => {
        const names = items.map(it => it.name);
        invoke('close_tg', { names })
        setData((data) => {
            return data.map(it => {
                if (names.includes(it.name)) {
                    return { ...it, openTg: false }
                }
                return it
            })
        })
    }
    const onCloseAllTg = () => {
        invoke('close_all_tg');
        setData((data) => {
            return data.map(it => {
                return { ...it, openTg: false }
            })
        })
        message.success('已关闭所有Telegram程序')
    }
    const column = columns({ onOpen, onClose, openTelegram, onCloseTg });
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
                            icon={<Chromeicon width={20} height={20} />}
                            size='large'
                            autoInsertSpace={false}
                            onClick={() => {
                                onOpen(selectedRows);
                                setSelectedRowKeys([]);
                                setSelectedRows([]);
                            }}
                            disabled={selectedRowKeys.length === 0}
                        >chrome</Button>
                        <Button
                            type='primary'
                            icon={<Tgicon width={20} height={20} />}
                            size='large'
                            autoInsertSpace={false}
                            onClick={() => {
                                openTelegram(selectedRows);
                                setSelectedRowKeys([]);
                                setSelectedRows([]);
                            }}
                            disabled={selectedRowKeys.length === 0}
                        >tg</Button>

                        <Tooltip title='关闭所有打开的chrome'>
                            <Button
                                icon={<PoweroffOutlined />}
                                size='large'
                                onClick={onCloseAll}
                            >
                                chrome
                            </Button>
                        </Tooltip>
                        <Tooltip title='关闭所有打开的tg'>
                            <Button
                                icon={<PoweroffOutlined />}
                                size='large'
                                onClick={onCloseAllTg}
                            >
                                tg
                            </Button>
                        </Tooltip>
                    </Space>
                </div>

            </div>
            <div className='list-table'>
                <Table
                    scroll={{ y: 600, x }}
                    rowSelection={{
                        fixed: true,
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys)
                            setSelectedRows(selectedRows)
                        }
                    }}
                    locale={{ emptyText: '暂无数据' }}
                    rowKey='id'
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


