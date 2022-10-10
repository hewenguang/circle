import each from '@/utils/each';
import noop from '@/utils/noop';
import App from '@/core/app.class';
import classname from '@/utils/classname';
import create from '@/utils/create';
import { isElement, isNumber } from '@/utils/is';
import { highlight, unhighlight } from './utils';

const name = 'focus';

class Plugin {
  private listener: () => void;
  private style: HTMLLinkElement;

  constructor(app: App) {
    this.listener = noop;
    this.style = create('style', {
      textContent: `
        html .${classname('noise')} {
          opacity: 0.1 !important;
        }
      `,
    });
    document.head.appendChild(this.style);
    this.update(app);
  }

  onTabActivated(app: App) {
    this.update(app);
  }

  update(app: App) {
    app.option({ name: 'layout' }).then((data) => {
      const layout = data || {};
      if (!isNumber(layout.focus_opacity)) {
        return;
      }
      this.style.textContent = `
        html .${classname('noise')} {
          opacity: ${layout.focus_opacity} !important;
        }
      `;
    });
  }

  // 进入阅读模式自动退出聚焦模式
  onRenderStart() {
    this.destory();
  }

  // 实时更新
  onLayoutFocusOpacity(app: App, opacity: number) {
    this.style.textContent = `
      html .${classname('noise')} {
        opacity: ${opacity} !important;
      }
    `;
  }

  start(app: App) {
    // 先销毁
    app.data('running') && app.fire('render_destory');
    this.style.disabled = false;
    const node = app.data('node');
    if (!node) {
      app.fire('notice', {
        type: 'warning',
        message: app.i10n('parser_error'),
      });
      return;
    }
    highlight(node);
    const handleClick = (event: any) => {
      const target = event.target;
      const items = Object.values(node);
      if (items.includes(target)) {
        return;
      }
      let find = false;
      each(items, (item?: HTMLElement) => {
        if (!item || !isElement(item)) {
          return;
        }
        if (item.contains(target)) {
          find = true;
          return find;
        }
        return;
      });
      !find && this.destory();
    };
    this.listener && this.listener();
    document.body.addEventListener('click', handleClick);
    this.listener = () => {
      document.body.removeEventListener('click', handleClick);
    };
  }

  destory() {
    this.listener && this.listener();
    this.style.disabled = true;
    unhighlight();
  }
}

window.definePlugin(name, Plugin);
