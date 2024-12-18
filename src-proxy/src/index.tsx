import ReactDOM from 'react-dom/client';
import {message} from 'antd'
import App from './App';

message.config({
  maxCount: 1,
})
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
      <App />
  );
}
