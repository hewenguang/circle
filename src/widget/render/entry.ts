import wait from '@/utils/wait';
import font from '@/utils/font';
import getDir from '@/utils/dir';
import shadow from '@/utils/shadow';
import action from '@/utils/action';
// import rgb2hex from '@/utils/rgb2hex';
import chinese from '@/utils/chinese';
import hex2rgb from '@/utils/hex2rgb';
import each from '@/utils/each';
import create from '@/utils/create';
import { getHash, updateHash } from '@/utils/hash';
import { isString, isElement, isUndefined, isPlainObject } from '@/utils/is';

export default function () {
  const app = this;
  const body = document.body;
  const defaultFont = font;
  const rtl = getDir() === 'rtl';
  const html = document.documentElement;
  const classnames = ['root'];
  app.data('mobile') && classnames.push('mobile');
  const root = create('div', {
    className: classnames.join(' '),
  });
  app.data('root', root);
  root.addEventListener('click', function (event: MouseEvent) {
    if (!app.data('running')) {
      return;
    }
    app.fire('click', event.target, event);
  });
  const resize = new ResizeObserver(function () {
    if (!app.data('running')) {
      return;
    }
    app.fire('resize_root', root);
  });
  resize.observe(root);
  // 滚动条样式
  const scrollbar = create('style', {
    textContent: [
      `::-webkit-scrollbar{width:var(--circle-track-width);}`,
      `::-webkit-scrollbar-track{background: var(--circle-track);}`,
      `::-webkit-scrollbar-thumb{border-radius: var(--circle-radius);background: var(--circle-thumb);}`,
    ].join(''),
  });
  document.head.appendChild(scrollbar);

  shadow({
    mode: 'open',
    style: [app.runtime.getURL('widget/antd.css'), window.inlineStyle],
    onReady: function (shadow: ShadowRoot, host: HTMLElement) {
      host.appendChild(
        create('style', {
          textContent: `
          html.circle-html{
            --circle-track-width:8px;
            --circle-track:#e2e2e2;
            --circle-thumb: #9e9e9e;
            --circle-radius: 4px;

            margin: 0px !important;
            padding: 0px !important;
            overflow: auto !important;
            background: #fff !important;
            max-width: initial !important;
          }
          html.circle-disable{
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          html.circle-html>body.circle-hidden{
            width:100% !important;
            height:100% !important;
            opacity:0 !important;
            pointer-events:none !important;
            position:fixed !important;
            top:0px !important;
            left:0px !important;
          }
        `,
        })
      );
      shadow.appendChild(root);
      app.data('shadow', shadow);
      app.doAction('dom_ready');
    },
  });

  app.on('render_after', () => {
    wait(function () {
      const container = root.querySelector('.container');
      if (isElement(root) && isElement(container)) {
        // 中英文字体
        chinese(container.innerText) && root.classList.add('zh-cn');
      }
    });
  });

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
          if (['font', 'cnfont', 'titlealign', 'align'].includes(styleKey)) {
            if (styleKey.indexOf('font') < 0) {
              root.style.setProperty(`--${styleKey}`, rtl ? 'right' : 'left');
            } else {
              root.style.setProperty(`--${styleKey}`, defaultFont);
            }
          } else {
            root.style.removeProperty(`--${styleKey}`);
          }
        } else {
          if (
            ['autohide', 'itemspace', 'groupspace', 'column'].includes(styleKey)
          ) {
            return;
          }
          switch (styleKey) {
            case 'imagealign':
              if (!style || style === 'reset') {
                root.style.setProperty(`--${styleKey}`, rtl ? 'right' : 'left');
              } else if (style === 'left') {
                root.style.setProperty('--imageleft', 0);
                root.style.setProperty('--imageright', 0);
              } else if (style === 'center') {
                root.style.setProperty('--imageleft', 'auto');
                root.style.setProperty('--imageright', 'auto');
              } else if (style === 'right') {
                root.style.setProperty('--imageleft', 'auto');
                root.style.setProperty('--imageright', 0);
              }
              break;
            case 'imagehide':
              root.style.setProperty('--imagehide', style ? 'none' : 'block');
              break;
            case 'bg':
              if (isString(style) && style.startsWith('#')) {
                const canvasValue: number[] = [];
                each(hex2rgb(style), function (item, key) {
                  const value = item - 18;
                  const itemValue = value < 0 ? 0 : value;
                  canvasValue.push(itemValue);
                  root.style.setProperty(`--${styleKey}-${key}`, itemValue);
                });
                root.style.setProperty('--canvas', style);
                root.style.setProperty(
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
                    root.style.setProperty(`--${styleKey}-${key}`, itemValue);
                  });
                  root.style.setProperty('--canvas', 'transparent');
                  root.style.setProperty(`--${styleKey}`, `${style} fixed`);
                }
              } else {
                root.style.setProperty(`--${styleKey}-r`, 237);
                root.style.setProperty(`--${styleKey}-g`, 237);
                root.style.setProperty(`--${styleKey}-b`, 237);
                root.style.setProperty('--canvas', 'transparent');
                root.style.setProperty(
                  `--${styleKey}`,
                  `center/cover no-repeat fixed url("${style}")`
                );
              }
              break;
            case 'track':
            case 'radius':
            case 'thumb':
              html.style.setProperty(`--circle-${styleKey}`, style);
              break;
            default:
              if (
                ['font', 'cnfont', 'titlealign', 'align'].includes(styleKey)
              ) {
                if (!style) {
                  if (styleKey.indexOf('font') < 0) {
                    root.style.setProperty(
                      `--${styleKey}`,
                      rtl ? 'right' : 'left'
                    );
                  } else {
                    root.style.setProperty(`--${styleKey}`, defaultFont);
                  }
                } else {
                  root.style.setProperty(`--${styleKey}`, style);
                }
              } else {
                root.style.setProperty(`--${styleKey}`, style);
              }
          }
        }
      }
    );
  });

  app.on('scroll_enable', function (enable: boolean) {
    if (enable) {
      html.classList.remove('circle-disable');
    } else {
      html.classList.add('circle-disable');
    }
  });

  app.on('render_destory', function () {
    if (!app.data('running')) {
      return;
    }
    scrollbar.disabled = true;
    app.data('running', false);
    body.classList.remove('circle-hidden');
    html.classList.remove('circle-html');
    root.style.display = 'none';
    action.call(app, 'ready');
    app.fire('render_destory_after');
    // 恢复之前的位置
    const scrollTop = app.data('scrollTop');
    window.scrollTo({
      left: 0,
      top: scrollTop || 0,
      // @ts-ignore
      behavior: 'instant',
    });
    app.data('scrollTop', 0);
    const { hashs } = getHash('circle');
    updateHash(hashs);
  });

  app.on('render_start', function () {
    if (app.data('running')) {
      return;
    }
    // 记录当前位置，退出恢复
    app.data('scrollTop', window.pageYOffset);
    scrollbar.disabled = false;
    app.data('running', true);
    body.classList.add('circle-hidden');
    html.classList.add('circle-html');
    root.style.display = 'block';
    action.call(app, 'enable');
    app.fire('render_start_after');
    const { hashs } = getHash('circle');
    hashs.unshift('circle=on');
    updateHash(hashs);
  });

  app.on('render', function () {
    if (app.data('running')) {
      app.fire('render_destory');
    } else {
      app.fire('render_start');
    }
  });

  return root;
}
