import React from 'react';
import App from '@/core/app.class';
import each from '@/utils/each';
import { isUndefined, isPlainObject } from '@/utils/is';
import wrapper, { IWrapperReturnValue } from '@/component/wrapper';
import Entry from './entry';
import './index.less';

type Item = {
  name: string;
  factory: () => any;
};

class Plugin {
  private _map: Array<Item>;
  private autohide: boolean;
  private timer: any = null;
  private host: IWrapperReturnValue;
  private container: HTMLElement;

  constructor(app: App) {
    this._map = [];
    this.autohide = false;
    this.host = wrapper.call(app, <Entry />);
    this.container = this.host.get();
    app.data('toolbar_root', this.container);
  }

  onFullscreenChange(app: App, fullscreen: boolean) {
    this.container.classList[fullscreen ? 'add' : 'remove']('fullscreen');
  }

  onToolbarCollapse(app: App, collapse: boolean) {
    this.container.classList[collapse ? 'add' : 'remove']('collapse');
    app.fire('backtop_visible', !collapse);
  }

  private setVisible(visible: boolean) {
    this.container.style.opacity = visible ? '1' : '0';
  }

  onTheme(app: App, value: any, key: string) {
    if (isUndefined(value)) {
      return;
    }
    each(
      isPlainObject(value)
        ? value
        : {
            [key]: value,
          },
      (style, styleKey) => {
        if (
          !['autohide', 'itemspace', 'groupspace', 'color'].includes(styleKey)
        ) {
          return;
        }
        if (styleKey === 'autohide') {
          if (isUndefined(style)) {
            return;
          }
          this.autohide = style;
          this.timer && clearTimeout(this.timer);
          this.setVisible(!style);
        } else {
          this.container.style.setProperty(`--${styleKey}`, style);
        }
      }
    );
  }

  async start(app: App) {
    this.container.style.removeProperty('display');
    this._map = [];
    const enter = {
      name: 'mouseenter',
      factory: () => {
        if (!this.autohide) {
          return;
        }
        this.timer && clearTimeout(this.timer);
        this.setVisible(true);
      },
    };
    this.container.addEventListener(enter.name, enter.factory);
    this._map.push(enter);
    const leave = {
      name: 'mouseleave',
      factory: () => {
        if (!this.autohide) {
          return;
        }
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.setVisible(false);
        }, 2000);
      },
    };
    this.container.addEventListener(leave.name, leave.factory);
    this._map.push(leave);
    // 样式设置
    const layout = await app.option({ name: 'layout' });
    if (layout) {
      !isUndefined(layout.itemspace) &&
        app.fire('theme', layout.itemspace, 'itemspace');
      !isUndefined(layout.groupspace) &&
        app.fire('theme', layout.groupspace, 'groupspace');
      if (!isUndefined(layout.autohide)) {
        this.autohide = layout.autohide;
        this.setVisible(!layout.autohide);
      }
    }
  }

  destory() {
    this._map.forEach((item: Item) => {
      this.container.removeEventListener(item.name, item.factory);
    });
    this._map = [];
    this.container.style.setProperty('display', 'none');
  }
}

window.definePlugin('toolbar', Plugin);
