import React from 'react';
import noop from '@/utils/noop';
import App from '@/core/app.class';
import hex2rgb from '@/utils/hex2rgb';
import each from '@/utils/each';
import { updateHash } from '@/utils/hash';
import scrollIntoView from '@/utils/scrollintoview';
import { isString, isUndefined, isPlainObject, isElement } from '@/utils/is';
import Entry from './entry';
import PluginBase from '@/utils/plugin.class';
import './index.less';

const name = 'outline';

class Plugin extends PluginBase {
  private root: HTMLElement;
  private lister: () => void;

  constructor(app: App) {
    super(app, <Entry />);
    this.root = this.container.get();
    this.lister = noop;
    // 兼容 antd 的 anchor 组件
    const oldGetElementById = document.getElementById.bind(document);
    document.getElementById = function (id: string) {
      if (!id) {
        return id;
      }
      const shadow = app.data('shadow');
      if (!shadow || !app.data('running')) {
        return oldGetElementById(id);
      }
      return shadow.getElementById(id);
    };
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
        if (style === 'reset') {
          this.root.style.removeProperty(`--${styleKey}`);
        } else {
          if (
            ![
              'track-width',
              'track',
              'thumb',
              'radius',
              'size',
              'weight',
              'font',
              'space',
              'title1weight',
              'lineheight',
            ].includes(styleKey)
          ) {
            return;
          }
          switch (styleKey) {
            case 'bg':
              if (isString(style) && style.startsWith('#')) {
                const canvasValue: Array<number> = [];
                each(hex2rgb(style), function (item) {
                  const value = item - 18;
                  const itemValue = value < 0 ? 0 : value;
                  canvasValue.push(itemValue);
                });
                this.root.style.setProperty(
                  `--${styleKey}`,
                  `rgb(${canvasValue.join(', ')})`
                );
              } else if (isString(style) && style.startsWith('linear')) {
                this.root.style.setProperty(`--${styleKey}`, style);
              } else {
                this.root.style.setProperty(
                  `--${styleKey}`,
                  `center/cover no-repeat url("${style}")`
                );
              }
              break;
            default:
              this.root.style.setProperty(`--${styleKey}`, style);
          }
        }
      }
    );
  }

  onPluginHot(
    app: App,
    plugin: {
      id: string;
      enable: boolean;
    }
  ) {
    if (plugin.id !== name) {
      return;
    }
    if (plugin.enable) {
      const container = app.data('container');
      isElement(container) && app.fire('outline_render', container);
    } else {
      app.fire('outline_empty');
    }
  }

  start(app: App) {
    super.start(app, true);
    this.lister && this.lister();
    function hashChange() {
      const root = app.data('root');
      if (!root) {
        return;
      }
      const currentHash = location.hash;
      if (!currentHash) {
        return;
      }
      let currentTarget;
      try {
        currentTarget = root.querySelector(currentHash);
        updateHash();
      } catch (event) {
        //
      }
      if (!currentTarget) {
        return;
      }
      scrollIntoView(currentTarget);
    }
    window.addEventListener('hashchange', hashChange);
    this.lister = () => {
      window.removeEventListener('hashchange', hashChange);
    };
  }

  destory() {
    super.destory();
    this.lister && this.lister();
  }
}

window.definePlugin(name, Plugin);
