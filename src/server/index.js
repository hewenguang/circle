import Server from './includes/class.server';
import hooks from './hooks';
import database from './database';
import helper from './helper';
import menus from './menus';
// import analytics from './analytics';

window.app = new Server({
  database: {
    name: 'cc',
    tables: ['option', 'plugin'],
  },
});

// 挂载勾子
hooks(app);
database(app);
helper();
menus();

//数据统计
// analytics(app);

// 启动应用
app.init();

