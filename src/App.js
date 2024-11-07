import { NavLink, Link, Outlet } from 'react-router-dom'
import { ReactComponent as LogoSvg } from './assets/logo.svg'
import { ReactComponent as SettingSvg } from './assets/setting.svg'
import { ReactComponent as ChromeSvg } from './assets/chrome.svg'
import { ReactComponent as TelegramSvg } from './assets/telegram.svg'
import "./App.css";

function App() {

  return (
    <>
      <aside className="side">
        <h1><LogoSvg />启动</h1>
        <ul>
          <li>
            <NavLink
              to='/'><ChromeSvg/>chrome</NavLink>
          </li>
          {/* <li>
            <NavLink
              to='/telegram'><TelegramSvg/>telegram</NavLink>
          </li> */}
        </ul>
      </aside>
      <div className="main">
        <header className='main-header'>
          <div/>
          <div className='set'><Link to='/setting'><SettingSvg/></Link></div>
        </header>
        <div className='main-body'>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
