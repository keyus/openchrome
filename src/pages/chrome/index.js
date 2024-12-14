
import { Input, Form, Select, Checkbox, Button, Space, Table } from 'antd'
import { SearchOutlined, PlayCircleOutlined, CloseCircleOutlined, DeleteOutlined, ReloadOutlined, } from '@ant-design/icons'
import './style.css';
import columns from './columns';
import testData from './test'

export default function Chrome() {
    const [form] = Form.useForm();

    const column = columns();
    const x = column.reduce((a, b) => { return a + b.width }, 0)

    return (
        <div>
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
                                { label: '分组1', value: 5 },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name='search'
                    >
                        <Input size="large" placeholder="搜索名字" prefix={<SearchOutlined />} />
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
                        <Button icon={<DeleteOutlined />} size='large' />
                    </Space>
                </div>
                <div>
                    <Space>
                        <Button icon={<ReloadOutlined />} size='large' />
                    </Space>
                </div>
            </div>
            <div className='list-table'>
                <Table
                    scroll={{ y: 330, x }}
                    rowSelection={{
                        fixed: true,
                    }}
                    columns={column}
                    dataSource={testData}
                />
            </div>
        </div>
    )
}


