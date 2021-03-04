import Server from './includes/class.server';
import hooks from './hooks';

window.app = new Server({
  database: {
    name: 'cc',
    tables: ['option', 'plugin'],
  },
});

// 挂载勾子
hooks(app);

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

// <!-- Global site tag (gtag.js) - Google Analytics -->
// <script async src="https://www.googletagmanager.com/gtag/js?id=G-582ZS82CBJ"></script>
// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());

//   gtag('config', 'G-582ZS82CBJ');
// </script>

// (function() {
//   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//   ga.src = 'https://ssl.google-analytics.com/ga.js';
//   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
// })();
