import Server from './includes/class.server';
import hooks from './hooks';
import database from './database';
import listener from './listener';
import analytics from './analytics';

window.app = new Server({
  database: {
    name: 'cc',
    tables: ['option', 'plugin'],
  },
});

// 挂载勾子
hooks(app);
database(app);
listener();

//数据统计
analytics(app);

// 启动应用
app.init();


// chrome.webNavigation.onCompleted.addListener(function(details) {
//   if(details.frameId === 0) {
//       chrome.tabs.executeScript(details.tabId, {"file": "content.js"}); 
//   }
// });
