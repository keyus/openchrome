import { NavLink, Outlet,   useMatches } from 'react-router-dom'
import { Avatar } from 'antd'
import { GlobalOutlined, OneToOneOutlined, DesktopOutlined, CloudServerOutlined  } from '@ant-design/icons'
import { ReactComponent as LogoSvg } from './assets/logo.svg'
import "./App.css";

function App() {
  const matches = useMatches();
  const currentRoute = matches.at(-1);
  const title = currentRoute?.handle?.title;
  
  return (
    <>
      <aside className="side">
        <h1><LogoSvg />InWen</h1>
        <ul>
          <li>
            <NavLink
              to='/'><GlobalOutlined />环境管理</NavLink>
          </li>
          <li>
            <NavLink to='/chrome_app'><CloudServerOutlined />浏览器应用</NavLink>
          </li>
          
        </ul>
        <div className='space-line'/>
        <ul>
          <li>
            <NavLink to='/sync' data-disabled><DesktopOutlined />窗口同步</NavLink>
          </li>
          <li>
            <NavLink to='/group' data-disabled><OneToOneOutlined />分组管理</NavLink>
          </li>
        </ul>
      </aside>
      <div className="main">
        <header className='main-header'>
          <h2>{title}</h2>
          <div className='set'><Avatar size={40}>USER</Avatar></div>
        </header>
        <div className='main-body'>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
