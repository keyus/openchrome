import { MoreOutlined, AlignRightOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { Space, Button, } from 'antd'
import dayjs from 'dayjs'

export default function columns(props = {}) {
    const { onOpen, onClose } = props
    return [
        {
            title: '编号/名称',
            dataIndex: 'name',
            width: 100,
            fixed: 'left',
            render(val, record) {
                if(!val) return '-'
                const isTag = val.toLowerCase().includes('58e0')
                return (
                    <span className={isTag ? 'tag-58e0' : ''}>
                        {val}
                    </span>
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
            title: '最近打开',
            dataIndex: 'last_open_time',
            width: 120,
            render(val){
                if(!val) return 
                return dayjs(val).format('MM-DD HH:mm')
            }
        },
        {
            title: '分组',
            dataIndex: 'group',
            width: 100,
        },

        {
            title: 'IP',
            dataIndex: 'location',
            width: 140,
            render(val) {
                return (
                    <Space><span style={{ color: '#ed8871' }}><EnvironmentOutlined /></span>{val}</Space>
                )
            }
        },
       
        {
            title: '标签',
            dataIndex: 'tags',
            width: 140,
        },
        
        
        {
            title: '操作',
            width: 100,
            fixed: 'right',
            align: 'right',
            render(record) {
                if (record.open) {
                    return (
                        <Button type='primary' ghost danger onClick={() => onClose([record])}>关闭</Button>
                    )
                }
                return (
                    <Button type='primary'  onClick={() => onOpen([record])}>打开</Button>
                )
            }
        },
        // {
        //     title: <AlignRightOutlined />,
        //     width: 100,
        //     fixed: 'right',
        //     align: 'center',
        //     render() {
        //         return (
        //             <Button icon={<MoreOutlined />} />
        //         )
        //     }
        // },
    ]
}