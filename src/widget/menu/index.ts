import { keys } from '@/global';
import App from '@/core/app.class';
import each from '@/utils/each';
import { isFunction } from '@/utils/is';

type Item = {
  id: string;
  title: string;
  checked: boolean;
};

class Plugin {
  private hooks: {
    [index: string]: () => void;
  };

  constructor() {
    this.hooks = {};
  }

  onPluginHot(
    app: App,
    plugin: {
      id: string;
      enable: boolean;
    }
  ) {
    // 必须是右键菜单的开关
    if (plugin.id !== 'menu') {
      return;
    }
    if (plugin.enable) {
      app.send('menu', {
        action: 'start',
      });
      return;
    }
    app.send('menu', {
      action: 'destory',
    });
  }

  onMenuHot(app: App, menu: Item, id: string) {
    if (menu.checked) {
      app.send('menu', {
        id,
        action: 'create',
        title: menu.title,
      });
      this._bind(app, id);
    } else {
      app.send('menu', {
        id,
        action: 'remove',
      });
      isFunction(this.hooks[`m_${id}`]) && this.hooks[`m_${id}`]();
      delete this.hooks[`m_${id}`];
    }
  }

  private _bind(app: App, name: string) {
    const field = `m_${name}`;
    if (this.hooks[field]) {
      return;
    }
    this.hooks[field] = app.on(field, () => {
      if (keys.includes(name)) {
        app.fire(name);
      } else {
        if (app.data('running')) {
          app.fire(name);
        } else {
          app.fire('notice', {
            type: 'warning',
            key: 'only_in_reader',
            message: app.i10n('only_in_reader'),
          });
        }
      }
    });
  }

  start(app: App) {
    this.destory();
    app
      .option({
        table: 'menu',
      })
      .then((data) => {
        each(data, (item: Item) => {
          item.checked && this._bind(app, item.id);
        });
      });
  }

  destory() {
    // 先移除绑定
    each(this.hooks, (cancel: () => void) => {
      cancel();
    });
    this.hooks = {};
  }
}

window.definePlugin('menu', Plugin);
