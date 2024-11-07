import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from 'antd'
import { createHashRouter, RouterProvider, } from 'react-router-dom'
import Chrome from './pages/chrome'
import Telegram from './pages/telegram'
import Setting from './pages/setting'


ReactDOM.createRoot(document.getElementById("root")).render(
    <ConfigProvider>
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
                        // {
                        //     path: 'telegram',
                        //     element: <Telegram />
                        // },
                        {
                            path: 'setting',
                            element: <Setting />
                        },
                    ]
                },
            ])}
        />
    </ConfigProvider>
);
