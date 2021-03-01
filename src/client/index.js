import Client from './class.client';

const app = new Client;
window.app = app;

// 加载解析引擎
app.loadPlugin('parser');
