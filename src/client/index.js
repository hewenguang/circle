import Client from './class.client';

const app = new Client;
window.app = app;

// 加载解析引擎
app.loadPlugin('parser');

// 加载聚焦模式
app.addAction('circle-focus', function(){
  app.loadPlugin('focus');
});
// 快捷键 ff 设置
app.addAction('double-keyup', function(keyCode){
  if(keyCode !== 70){
    return;
  }
  app.loadPlugin('focus');
  app.doAction('focus');
});
