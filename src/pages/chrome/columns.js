import { MoreOutlined, AlignRightOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { Space, Button, } from 'antd'

export default function columns(props = {}) {
    const { onOpen, onClose } = props
    return [
        {
            title: '编号/名称',
            dataIndex: 'title',
            width: 100,
            fixed: 'left',
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
            title: '最近打开',
            dataIndex: 'time',
            width: 140,
        },
        {
            title: '标签',
            dataIndex: 'tag',
            width: 140,
        },
        {
            title: '备注',
            dataIndex: 'mark',
            width: 140,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 140,
        },
        {
            title: '操作',
            width: 180,
            fixed: 'right',
            align: 'right',
            render(record) {
                if (record.open) {
                    return (
                        <Button type='primary' ghost danger onClick={() => onClose(record)}>关闭</Button>
                    )
                }
                return (
                    <Button type='primary'  onClick={() => onOpen(record)}>打开</Button>
                )
            }
        },
        {
            title: <AlignRightOutlined />,
            width: 100,
            fixed: 'right',
            align: 'center',
            render() {
                return (
                    <Button icon={<MoreOutlined />} />
                )
            }
        },
    ]
}