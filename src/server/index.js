import Server from './includes/class.server';
import hooks from './hooks';
import analytics from './analytics';

window.app = new Server({
  database: {
    name: 'cc',
    tables: ['option', 'plugin'],
  },
});

// 挂载勾子
hooks(app);
//数据统计
analytics(app);

// api.contextMenus.create({
//   enabled: true,
//   title: '框选内容',
//   contexts: ['page'],
//   id: 'circle-selection',
//   onclick: (info, tab) => {
//     if(info.pageUrl.startsWith('chrome')){
//       return;
//     }
//     console.log(info, tab);
//     api.tabs.executeScript(tab.id, {
//       code: 'console.log("selection")',
//       allFrames: false,
//       matchAboutBlank: false,
//       runAt: 'document_idle',
//     });
//   },
// }, function(){
//   console.log('创建成功');
// });

// 启动应用
app.init();
