import React from 'react';
import noop from '@/utils/noop';
import App from '@/core/app.class';
import Entry from './entry';
import PluginBase from '@/utils/plugin.class';
import './index.less';

const name = 'setting';

class Plugin extends PluginBase {
  private _hookBuilt: Array<() => void> = [];

  constructor(app: App) {
    const size = app.data('mobile') ? 'small' : 'middle';
    const placement = app.data('mobile') ? 'bottom' : 'right';
    super(
      app,
      <Entry size={size} placement={placement} />,
      {
        placement,
        width: 450,
        plugin: name,
        title: app.i10n(name),
      },
      noop,
      {
        hookInside: false,
      }
    );
  }

  // 退出关闭
  onRenderDestoryAfter(app: App) {
    app.data('drawer') === name && this.action(app);
  }

  onDrawerSettingChange(app: App, visible: boolean) {
    if (visible) {
      return;
    }
    app.fire('setting_destory_done');
  }

  onLayoutNoticePlacement(app: App, placement: string) {
    app.fire('notice', {
      placement,
      key: 'notice_placement_demo',
      message: app.i10n('notice_placement_demo'),
    });
  }

  action(app: App) {
    app.fire('drawer', name);
  }

  start(app: App) {
    super.start(app);
    this.destoryHookBuilt();
    [
      'style',
      'skin',
      'layout',
      'toolbar',
      'keys',
      'menu',
      'lists',
      'plugin',
      'config',
      'about',
    ].forEach((key) => {
      this._hookBuilt.push(
        app.on(`setting_${key}`, () => {
          app.data('drawer') !== 'setting' && app.fire('drawer', name);
          setTimeout(() => {
            app.fire('setting_activekey', key);
          }, 500);
        })
      );
    });
  }

  private destoryHookBuilt() {
    this._hookBuilt.length > 0 && this._hookBuilt.forEach((cancel) => cancel());
  }

  destory() {
    super.destory();
    this.destoryHookBuilt();
  }
}

window.definePlugin(name, Plugin);
