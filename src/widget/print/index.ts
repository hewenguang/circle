import each from '@/utils/each';
import App from '@/core/app.class';
import create from '@/utils/create';
import insertStyle from '@/utils/insert-style';
import './index.less';

type Item = {
  name: string;
  factory: (value?: any) => void;
};

class Plugin {
  private _media: MediaQueryList;
  private _map: Array<Item> = [];

  constructor(app: App) {
    this._media = window.matchMedia('print');
    insertStyle.call(app, 'print', window.inlineStyle);
    document.head.appendChild(
      create('style', {
        textContent: `
          html.circle-pure{
            --circle-track-width:0;
          }
        `,
      })
    );
  }

  action() {
    window.print();
  }

  onPrintChange(app: App, active: boolean) {
    const root = app.data('root');
    if (!root || !app.data('running')) {
      return;
    }
    root.classList[active ? 'add' : 'remove']('pure');
    document.documentElement.classList[active ? 'add' : 'remove'](
      'circle-pure'
    );
  }

  start(app: App) {
    this._map = [];
    if (navigator.userAgent.indexOf('Firefox') >= 0) {
      // Firefox
      const before = {
        name: 'beforeprint',
        factory: () => {
          if (!app.data('running')) {
            return;
          }
          app.fire('print_change', true);
        },
      };
      this._map.push(before);
      window.addEventListener(before.name, before.factory);
      const after = {
        name: 'afterprint',
        factory: () => {
          if (!app.data('running')) {
            return;
          }
          app.fire('print_change', false);
        },
      };
      this._map.push(after);
      window.addEventListener(after.name, after.factory);
    } else {
      const match = {
        name: 'change',
        factory: (mql: any) => {
          if (!app.data('running')) {
            return;
          }
          app.fire('print_change', !!mql.matches);
        },
      };
      this._map.push(match);
      this._media.addEventListener(match.name, match.factory);
    }
  }

  destory() {
    each(this._map, ({ name, factory }: Item) => {
      if (name === 'change') {
        this._media.removeEventListener(name, factory);
      } else {
        window.removeEventListener(name, factory);
      }
    });
    this._map = [];
  }
}

window.definePlugin('print', Plugin);
