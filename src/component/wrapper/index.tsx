import React from 'react';
import each from '@/utils/each';
import AppContext from '@/hooks';
import hex2rgb from '@/utils/hex2rgb';
import { createRoot } from 'react-dom/client';
import entry, { IEntryProps } from '@/utils/entry';
import { isString, isUndefined, isPlainObject } from '@/utils/is';
import './index.less';

export interface IWrapperReturnValue {
  get: () => HTMLElement;
  show: () => void;
  hide: () => void;
}

export default function (
  children: React.ReactElement,
  callback?: (root: HTMLElement) => void,
  options?: IEntryProps
) {
  const app = this;
  const container = entry.call(app, options);

  app.on('theme', function (value: any, key: string) {
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
          container.style.removeProperty(`--${styleKey}`);
        } else {
          if (!['color', 'link', 'bg'].includes(styleKey)) {
            return;
          }
          switch (styleKey) {
            case 'bg':
              if (isString(style) && style.startsWith('#')) {
                const canvasValue: number[] = [];
                each(hex2rgb(style), function (item, key) {
                  const value = item - 18;
                  const itemValue = value < 0 ? 0 : value;
                  canvasValue.push(itemValue);
                  container.style.setProperty(
                    `--${styleKey}-${key}`,
                    itemValue
                  );
                });
                container.style.setProperty('--canvas', style);
                container.style.setProperty(
                  `--${styleKey}`,
                  `rgb(${canvasValue.join(', ')})`
                );
              } else if (isString(style) && style.startsWith('linear')) {
                const linear = style
                  .replace(/linear-gradient\((.*?)\)/, '$1')
                  .split(',')
                  .map((item: string) => item.trim().split(' ').shift());
                if (linear && linear.length === 3) {
                  each(hex2rgb(linear[1]), function (item, key) {
                    const value = item - 18;
                    const itemValue = value < 0 ? 0 : value;
                    container.style.setProperty(
                      `--${styleKey}-${key}`,
                      itemValue
                    );
                  });
                  container.style.setProperty('--canvas', 'transparent');
                  container.style.setProperty(
                    `--${styleKey}`,
                    `${style} fixed`
                  );
                }
              }
              break;
            default:
              container.style.setProperty(`--${styleKey}`, style);
          }
        }
      }
    );
  });

  callback && callback.call(app, container);

  setTimeout(function () {
    app.fire('render_theme');
  }, 0);

  const root = createRoot(container);
  root.render(
    <AppContext.Provider value={{ app, root: container }}>
      {React.cloneElement(children, {
        app,
        root: container,
        ...children.props,
      })}
    </AppContext.Provider>
  );

  return {
    get() {
      return container;
    },
    show() {
      container.style.display = 'block';
    },
    hide() {
      container.style.display = 'none';
    },
  };
}
