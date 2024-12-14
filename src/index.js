import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from 'antd'
import { createHashRouter, RouterProvider, } from 'react-router-dom'
import Chrome from './pages/chrome'
import Telegram from './pages/telegram'
import Setting from './pages/setting'


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
                            element: <Chrome />
                        },
                    ]
                },
            ])}
        />
    </ConfigProvider>
);
