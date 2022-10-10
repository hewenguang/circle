import { keys } from '@/global';
import App from '@/core/app.class';
import each from '@/utils/each';
import isTag from '@/utils/istag';
import keyboard from '@/utils/keyboard';

type Item = {
  id: string;
  value: string;
  checked: boolean;
};

class Plugin {
  private timer: any;
  private keys: string[];
  private counter: number;
  private map: {
    [index: string]: string;
  };

  constructor() {
    this.keys = [];
    this.map = {};
    this.counter = 0;
    this.timer = null;
  }

  private _fire(app: App, value: string) {
    let id = '';
    each(this.map, (item: string, key) => {
      if (item == value) {
        id = key;
        return true;
      }
      return;
    });
    if (!id) {
      return;
    }
    if (keys.includes(id)) {
      app.fire(id);
    } else {
      if (app.data('running')) {
        app.fire(id);
      } else {
        app.fire('notice', {
          type: 'warning',
          key: 'only_in_reader',
          message: app.i10n('only_in_reader'),
        });
      }
    }
  }

  onKeydown(app: App, event: KeyboardEvent) {
    let activeElement = document.activeElement;
    if (
      activeElement &&
      activeElement.shadowRoot &&
      activeElement.shadowRoot.activeElement
    ) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
    // 输入过程
    if (isTag(activeElement, 'input') || isTag(activeElement, 'textarea')) {
      return;
    }
    // 可编辑 div
    if (
      activeElement &&
      isTag(activeElement, 'div') &&
      // @ts-ignore
      activeElement.contentEditable === 'true'
    ) {
      return;
    }
    const value = keyboard(event);
    value && this.keys.push(value);
    this.counter++;
    if (this.counter === 1) {
      this.timer = setTimeout(() => {
        this.counter = 0;
        if (this.keys.length <= 0) {
          return;
        }
        this._fire(app, this.keys.join(' '));
        this.keys = [];
      }, 500);
    } else if (this.counter === 2) {
      this.timer && clearTimeout(this.timer);
      this.counter = 0;
      if (this.keys.length <= 0) {
        return;
      }
      this._fire(app, this.keys.join(' '));
      this.keys = [];
    }
  }

  onKeysHot(app: App, keys: Item, id: string) {
    if (keys.checked) {
      this.map[id] = keys.value;
    } else {
      delete this.map[id];
    }
  }

  onTabActivated(app: App) {
    this.start(app);
  }

  start(app: App) {
    this.map = {};
    app
      .option({
        table: 'keys',
      })
      .then((data) => {
        each(data, (item: Item) => {
          item.checked && (this.map[item.id] = item.value);
        });
      });
  }

  destory() {
    this.map = {};
  }
}

window.definePlugin('keys', Plugin);
