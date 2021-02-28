import React from 'react';
import ReactDOM from 'react-dom';
import API from 'src/includes/class.api';
import App from './pages/index';
import './reset.less';
import './index.less';

window.api = new API;
window.url = 'https://ranhe.xyz/api/plugins.json';

ReactDOM.render(<App />, document.getElementById('root'));
