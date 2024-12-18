import { List, Alert, Badge, Button, Space, message } from 'antd';
import { WifiOutlined, } from '@ant-design/icons';
import LogoSvg from './assets/logo.svg?react';
import './App.css';
import { useState } from 'react';
// import { useRequest } from 'ahooks';
// import http from './http';



const App = () => {

  const [list, setList] = useState<{
    id: string;
    username: string;
    password: string;
    proxy_address: string;
    port: number;
    valid: boolean;
    last_verification: string;
    country_code: string;
    city_name: string;
    created_at: string;
  }[]>([]);

  const onClear = () => {
    message.success('已成功清除')
    chrome.runtime.sendMessage({ action: 'clearProxy' });
  }

  return (
    <div className="content">
      <h1><LogoSvg width={40} height={40} />AutoProxy</h1>
      <div className='user-status'>
        <Alert message='当前为自动代理模式' showIcon type='success' />
        <Space>
          <Button type='primary' icon={<WifiOutlined />}>连接</Button>
          <Button danger onClick={onClear}>清除代理</Button>
          <Button type='link' href='https://en.ipip.net' target='_blank'>我的IP</Button>
        </Space>
      </div>
      {
        Array.isArray(list) && list.length > 0 &&
        <div className='list-proxy'>
          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => {
              return (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={item.city_name}
                    description={
                      <div>
                        <div>{item.proxy_address}:{item.port}</div>
                      </div>
                    }
                  />
                  <div>{
                    item.valid ?
                      <Badge status="success" text="可用" /> :
                      <Badge status="error" text="错误" />
                  }</div>
                  <div style={{ marginLeft: 15 }}>
                    <Button type="primary" disabled={!item.valid}>连接</Button>
                  </div>
                </List.Item>
              )
            }}
          />
        </div>
      }

    </div>
  );
};

export default App;
