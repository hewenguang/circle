import log from '@/log';
import React from 'react';
import AppContext from '@/hooks';
import App from '@/core/app.class';
import { createRoot } from 'react-dom/client';
import { isString, isBoolean } from '@/utils/is';
import Home from './home';
import entry from './entry';
import './index.less';

class Plugin {
  private container: HTMLElement;
  private color_scheme: 'dark' | 'light';

  constructor(app: App) {
    this.container = entry.call(app);
    const root = createRoot(this.container);
    root.render(
      <AppContext.Provider value={app}>
        <Home />
      </AppContext.Provider>
    );
    const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.color_scheme = mediaQueryDark.matches ? 'dark' : 'light';
    mediaQueryDark.addEventListener('change', (mediaQueryListEvent) => {
      if (!app.data('running')) {
        return;
      }
      const scheme = mediaQueryListEvent.matches ? 'dark' : 'light';
      this.color_scheme = scheme;
      app.fire('render_theme', undefined, scheme);
    });
  }

  onExit(app: App) {
    app.fire('render_destory');
  }

  onExitclose(app: App) {
    app.send('tab', { action: 'query' }, (error?: string, data?: any) => {
      if (error) {
        log(error);
        return;
      }
      Array.isArray(data) &&
        data.length === 1 &&
        app.send('tab', {
          action: 'create',
          value: { active: true },
        });
      app.send('tab', { action: 'remove' });
    });
  }

  onImagehide(app: App) {
    app.option('style').then((data: any = {}) => {
      const hidden = !data.imagehide;
      data.imagehide = hidden;
      app
        .option({
          name: 'style',
          value: data,
        })
        .then(() => {
          app.fire('theme', hidden, 'imagehide');
        });
    });
  }

  onSettingDestoryDone(app: App) {
    // 退出时需要恢复修改因跟随系统预览导致的主题错误
    app.fire('render_theme');
  }

  onTabActivated(app: App) {
    if (!app.data('running')) {
      return;
    }
    this.onRenderTheme(app);
  }

  onRenderTheme(app: App, id?: string, name?: string) {
    (id ? [id] : ['style', 'skin']).forEach((item) => {
      app.option(`${item}_night`).then((night: boolean) => {
        app
          .option(
            name && isString(name)
              ? `${item}${item === name ? '' : '_' + name}`
              : `${item}${
                  isBoolean(night) && night ? '_' + this.color_scheme : ''
                }`
          )
          .then((result) => {
            const data = result || {};
            delete data.id;
            delete data.changed;
            data && app.fire('theme', data);
          });
      });
    });
  }

  start(app: App) {
    app.fire('render_before');
    this.container.style.setProperty('display', 'block');
  }

  destory() {
    this.container.style.setProperty('display', 'none');
  }
}

window.definePlugin('render', Plugin);
