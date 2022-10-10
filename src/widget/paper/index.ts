import noop from '@/utils/noop';
import App from '@/core/app.class';
import observer from '@/utils/observer';
import { isElement } from '@/utils/is';
import insertStyle from '@/utils/insert-style';
import pluginManage from '@/utils/plugin-manage';
import resizeObserver from '@/utils/resize-observer';
import './index.less';

const name = 'paper';

class Plugin {
  private _timer: any;
  private _observer: () => void;
  private _observerResize: () => void;

  constructor(app: App) {
    this._observer = noop;
    this._observerResize = noop;
    insertStyle.call(app, 'paper', window.inlineStyle);
  }

  onResize(app: App) {
    this._timer && clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.sticky(app);
    }, 100);
  }

  onResizeRoot(app: App) {
    this._timer && clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.sticky(app);
    }, 100);
  }

  private sticky(app: App) {
    let offset = 26;
    if (!app.data('running')) {
      return;
    }
    const root = app.data('root');
    if (!root) {
      return;
    }
    const toolbarRoot = app.data('toolbar_root');
    if (!toolbarRoot) {
      return;
    }
    const target: any = toolbarRoot.querySelector('.toolbar');
    if (!target) {
      return;
    }
    const clientHeight = window.innerHeight;
    if (toolbarRoot.classList.contains('sticky')) {
      const container = root.querySelector('.container');
      if (!container) {
        return;
      }
      const rect = container.getBoundingClientRect();
      const clientWidth = window.innerWidth;
      if (clientWidth - rect.right > 50) {
        const top = rect.top;
        const topValue = top <= 0 ? 81 : top;
        offset = topValue + 20;
        !app.data('mobile') && target.style.setProperty('top', `${topValue}px`);
        target.style.setProperty('right', `${clientWidth - rect.right - 50}px`);
      } else {
        offset += 60;
        target.style.removeProperty('top');
        target.style.removeProperty('right');
      }
    } else {
      offset += 80;
      target.style.removeProperty('top');
      target.style.removeProperty('right');
    }
    target.style.setProperty('max-height', `${clientHeight - offset}px`);
  }

  action(app: App) {
    this.start(app);
  }

  destory(app: App) {
    const root = app.data('root');
    if (root) {
      root.classList.remove('paper');
      // 延迟处理获取值
      setTimeout(() => {
        if (root) {
          const solid = root.style.getPropertyValue('--bg');
          solid.startsWith('rgb') && root.classList.add('solid');
        }
      }, 100);
    }
    pluginManage.call(app, name, true);
    this.destoryToolbar(app);
  }

  destoryToolbar(app: App) {
    const toolbarRoot = app.data('toolbar_root');
    if (!toolbarRoot) {
      return;
    }
    toolbarRoot.classList.remove('sticky');
    this._observer && this._observer();
    this._observerResize && this._observerResize();
    // 延迟更新位置
    setTimeout(() => {
      this.sticky(app);
    }, 200);
  }

  start(app: App) {
    const root = app.data('root');
    if (root) {
      root.classList.add('paper');
      root.classList.remove('solid');
    }
    pluginManage.call(app, name);
    this.startToolbar(app);
  }

  startToolbar(app: App) {
    const toolbarRoot = app.data('toolbar_root');
    if (!toolbarRoot) {
      return;
    }
    toolbarRoot.classList.add('sticky');
    // 检测 class 变化
    this._observer = observer(
      toolbarRoot,
      (mutations: any) => {
        const mutation = mutations[0];
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          this._timer && clearTimeout(this._timer);
          this._timer = setTimeout(() => {
            this.sticky(app);
          }, 1000);
        }
      },
      {
        childList: false,
        attributes: true,
      }
    );
    // 延迟更新位置
    setTimeout(() => {
      this.sticky(app);
    }, 200);

    // 检测 container 变化
    const container = app.data('container');
    if (!isElement(container)) {
      return;
    }
    this._observerResize = resizeObserver(container, () => {
      this._timer && clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.sticky(app);
      }, 100);
    });
  }
}

window.definePlugin(name, Plugin);
