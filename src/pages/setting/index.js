
import { Form, Input, Button, Tag } from 'antd'
import { ReactComponent as ChromeSvg } from '../../assets/chrome.svg'
import { Store } from '@tauri-apps/plugin-store'
import { list } from '../../config'
import './style.css'

const store = await Store.load('settings.json');
const state = await store.get('desktopChrome');
console.log('store:',state);

export default function Setting() {
    const [form] = Form.useForm();
    const desktop_target = Form.useWatch('desktop_target', form);
    return (
        <div className=''>
            <h1>设置</h1>
            <Form
                form={form}
                layout='vertical'
                initialValues={{ desktop_target: 'chrome100' }}
            >
                <Form.Item label={<div className='tool-logo'><ChromeSvg />钱包名称</div>}>

                    <div className='list-tag'>
                        {
                            list.map((items) => {
                                const [key, item] = items;
                                return (
                                    <div className='item' key={item}><span className='number'>{key}</span><Tag closable >{item}</Tag></div>
                                )
                            })
                        }
                    </div>
                </Form.Item>
                <Form.Item
                    label='桌面文件夹名称'
                    help={`如完整路径：C:\\Users\\用户名\\Desktop\\${desktop_target}`}
                    name='desktop_target'>
                    <Input placeholder='输入桌面文件夹名称' maxLength={20} />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}