import { EnvironmentOutlined, SpotifyOutlined } from '@ant-design/icons'
import { Space, Button, } from 'antd'
import { ReactComponent as Chromeicon } from '../../assets/chrome.svg'
import { ReactComponent as Tgicon } from '../../assets/telegram.svg'
import dayjs from 'dayjs'

export default function columns(props = {}) {
    const { onOpen, onClose, openTelegram, onCloseTg } = props
    return [
        {
            title: '编号/名称',
            dataIndex: 'name',
            width: 120,
            fixed: 'left',
            render(val, record) {
                if (!val) return '-'
                const isTag = val.toLowerCase().includes('58e0')
                return (
                    <span className={isTag ? 'tag-58e0' : ''}>
                        {val}
                    </span>
                )
            }
        },
        {
            title: '最近打开',
            dataIndex: 'last_open_time',
            width: 120,
            render(val) {
                if (!val) return
                return dayjs(val).format('MM-DD HH:mm')
            }
        },
        {
            title: '指纹版本',
            dataIndex: 'chrome_version',
            width: 140,
            render(val,record) {
                return (
                    <Space>
                        <span>{val}</span>
                        <SpotifyOutlined
                            onClick={()=>{
                                onOpen([record], true)
                            }}
                            style={{ color: '#1677ff', fontSize: 18 }} />
                    </Space>
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'mark',
            width: 140,
            render(val) {
                return (
                    <span className='mark'>{val}</span>
                )
            }
        },


        {
            title: 'IP',
            dataIndex: 'location',
            width: 140,
            render(val) {
                return (
                    <Space><span style={{ color: '#1677ff' }}><EnvironmentOutlined /></span>{val}</Space>
                )
            }
        },
        {
            title: '分组',
            dataIndex: 'group',
            width: 100,
        },
        {
            title: '操作',
            width: 180,
            fixed: 'right',
            align: 'center',
            render(record) {
                return (
                    <Space>
                        <Button
                            type='primary'
                            danger={record.openChrome}
                            ghost
                            icon={<Chromeicon width={20} height={20} />}
                            onClick={() => {
                                if (record.openChrome) {
                                    onClose([record])
                                } else {
                                    onOpen([record])
                                }
                            }}>
                            {record.openChrome ? '关闭' : '打开'}
                        </Button>
                        <Button
                            type='primary'
                            ghost
                            danger={record.openTg}
                            icon={<Tgicon width={20} height={20} />}
                            onClick={() => {
                                if (record.openTg) {
                                    onCloseTg([record])
                                } else {
                                    openTelegram([record])
                                }
                            }} />
                    </Space>
                )
            }
        },
    ]
}