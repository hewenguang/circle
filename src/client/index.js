import Client from './class.client';

const app = new Client;
window.app = app;

// 加载解析引擎
app.loadPlugin('parser');
// 加载聚焦模式
app.addAction('circle-focus', function(){
  app.loadPlugin('focus');
});
