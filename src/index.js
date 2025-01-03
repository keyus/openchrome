import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from 'antd'
import { createHashRouter, RouterProvider, } from 'react-router-dom'
import Chrome from './pages/chrome'
import ChromeApp from './pages/chrome_app'
import db from './db/chrome'

// import Telegram from './pages/telegram'
// import Setting from './pages/setting'

await db.initInsert();
ReactDOM.createRoot(document.getElementById("root")).render(
    <ConfigProvider
        theme={{
            components: {
                Table: {
                    headerBg: '#fff',
                    headerColor: '#bcbec5',
                    cellFontSize: '13px',
                    footerBg: '#fff',
                    rowHoverBg: '#e9edfd',
                }
            }
        }}
    >
        <RouterProvider
            router={createHashRouter([
                {
                    path: '/',
                    element: <App />,
                    children: [
                        {
                            index: true,
                            element: <Chrome />,
                            loader: async () => {
                                return db.getAll();
                            },
                            handle: {
                                title: '环境管理'
                            }
                        },
                        {
                            path: 'chrome_app',
                            element: <ChromeApp />,
                            handle: {
                                title: '浏览器应用'
                            }
                        },
                    ]
                },
            ])}
        />
    </ConfigProvider>
);
