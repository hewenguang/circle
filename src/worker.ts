import each from '@/utils/each';
import noop from '@/utils/noop';
import Worker from '@/core/worker.class';

const app = new Worker();

const hooks = require.context('./worker', false, /\.ts$/);

each(
  hooks.keys().reduce((items: { [x: string]: any }, path: string) => {
    items[path.replace(/^\.\/(.*)\.ts$/, '$1')] = hooks(path).default;
    return items;
  }, {}),
  (hook: any, key: string) => {
    const api = key.split('-');
    if (api.length === 3 && api[2] === 'addListener') {
      app[api[0]] &&
        app[api[0]][api[1]].addListener(function (...args: any) {
          hook.apply(app, args);
        });
    } else {
      app.on(key, hook);
    }
  }
);

// 启用时无论如何都检查右键菜单
app.fire('menu', noop, {
  action: 'start',
});
