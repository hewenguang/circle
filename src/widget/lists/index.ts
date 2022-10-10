import url from '@/utils/url';
import App from '@/core/app.class';
import action from '@/utils/action';
import { isUndefined } from '@/utils/is';

type Item = {
  id: string;
  title: string;
  changed?: number;
  deny: boolean;
  site?: boolean;
  host?: string;
};

const table = 'lists';

class Plugin {
  private white: string;
  private black: string;
  private blackKey: string;
  private whiteKey: string;
  private blacksite: boolean;

  constructor() {
    this.blackKey = '';
    this.whiteKey = '';
    this.white = 'whitelist';
    this.black = 'blacklist';
    this.blacksite = false;
  }

  private isSite(item: Item) {
    if (!item.id) {
      return false;
    }
    return item.id === location.hostname;
  }

  private siteTitle() {
    const title = (document.title || '').trim();
    return title.replace(/[^|\-\\/>»]*[|\-\\/>»](.*)/gi, '$1');
  }

  private get(app: App): any {
    return app
      .option({
        table,
        name: location.hostname,
      })
      .then((site: any) =>
        app
          .option({
            table,
            name: url(),
          })
          .then((data) => {
            return Promise.resolve([site, data]);
          })
      );
  }

  private listsAdd(app: App, values: Item, callback?: () => void) {
    const id = values.id;
    const site = values.site;
    delete values.site;
    const deny = values.deny;
    app
      .option({
        table,
        name: id,
      })
      .then((result: any) => {
        // 存在，并且类型一致
        if (result && result.deny === deny) {
          app
            .option({
              table,
              name: id,
              value: 'remove',
            })
            .then(() => {
              if (deny) {
                action.call(app, 'ready');
                app.fire('notice', {
                  type: 'success',
                  message: app.i10n('lists_remove_success'),
                });
              } else {
                app.fire('notice', {
                  type: 'success',
                  message: app.i10n('lists_remove_success'),
                });
                setTimeout(() => {
                  app.fire(
                    'toolbar_state',
                    `${deny ? this.black : this.white}${site ? '_site' : ''}`,
                    'inactive'
                  );
                }, 0);
              }
              this.start(app);
              callback && callback();
              app.fire(`${table}_refetch`);
            });
        } else {
          isUndefined(values.host) && (values.host = location.hostname);
          app
            .option({
              table,
              name: id,
              value: values,
            })
            .then(() => {
              if (deny) {
                if (app.data('running')) {
                  app.fire('render_destory');
                } else {
                  app.fire('notice', {
                    type: 'success',
                    message: app.i10n('lists_add_success'),
                  });
                }
                action.call(app, 'disable');
              } else {
                const node = app.data('node');
                if (node && node.article && !app.data('running')) {
                  if (app.used('render')) {
                    app.fire('render');
                  } else {
                    app.doAction('parser_ready');
                  }
                } else {
                  app.fire('notice', {
                    type: 'success',
                    message: app.i10n('lists_add_success'),
                  });
                }
              }
              setTimeout(() => {
                app.fire(
                  'toolbar_state',
                  `${deny ? this.black : this.white}${site ? '_site' : ''}`,
                  'active'
                );
              }, 0);
              this.start(app);
              callback && callback();
              app.fire(`${table}_refetch`);
            });
        }
      });
  }

  onWhitelist(app: App) {
    this.listsAdd(app, {
      id: url(),
      deny: false,
      title: document.title,
    });
  }

  onWhitelistSite(app: App) {
    this.listsAdd(app, {
      site: true,
      deny: false,
      title: this.siteTitle(),
      id: location.hostname,
    });
  }

  onBlacklist(app: App) {
    this.listsAdd(app, {
      id: url(),
      deny: true,
      title: document.title,
    });
  }

  onBlacklistSite(app: App) {
    this.listsAdd(app, {
      site: true,
      deny: true,
      title: this.siteTitle(),
      id: location.hostname,
    });
  }

  filterParserAbort(app: App, hold: boolean) {
    if (this.blackKey) {
      return true;
    }
    return hold;
  }

  filterParserHold(app: App, hold: boolean) {
    if (this.whiteKey) {
      return false;
    }
    return hold;
  }

  filterActionClickedAbort(app: App) {
    if (this.blackKey) {
      app.fire(
        'notice',
        {
          duration: 0,
          btnText: app.i10n('remove'),
          message: app.i10n(`remove_blacklist${this.blacksite ? '_site' : ''}`),
        },
        () => {
          app
            .option({
              table,
              value: 'remove',
              name: this.blackKey,
            })
            .then(() => {
              this.blackKey = '';
              this.blacksite = false;
              setTimeout(() => {
                app.fire(
                  'toolbar_state',
                  `blacklist${this.blacksite ? '_site' : ''}`,
                  'inactive'
                );
              }, 0);
              app.fire('parser_start', document);
            })
            .catch((error) => {
              app.fire('notice', {
                type: 'error',
                message: error,
              });
            });
        }
      );
      return true;
    }
    return;
  }

  onListsChange(app: App) {
    this.start(app);
  }

  onTabUpdated(app: App) {
    this.start(app);
  }

  onTabActivated(app: App) {
    this.start(app);
  }

  async start(app: App) {
    const [site, current] = await this.get(app);
    if (!site && !current) {
      [
        this.black,
        this.white,
        `${this.black}_site`,
        `${this.white}_site`,
      ].forEach((item) => {
        app.send('menu', {
          id: item,
          action: 'update',
          title: app.i10n(`add_${item}`),
        });
      });
      return;
    }
    const siteData = site || {};
    const currentData = current || {};
    const id = siteData.id || currentData.id;
    const deny = siteData.deny || currentData.deny;
    if (deny) {
      this.blackKey = id;
      this.blacksite = this.isSite(siteData) || this.isSite(currentData);
      action.call(app, 'disable');
      // 如果在黑名单直接退出
      app.fire('render_destory');
      setTimeout(() => {
        app.fire(
          'toolbar_state',
          `${this.black}${site ? '_site' : ''}`,
          'active'
        );
      }, 0);
    } else {
      this.whiteKey = id;
      setTimeout(() => {
        app.fire(
          'toolbar_state',
          `${this.white}${site ? '_site' : ''}`,
          'active'
        );
      }, 0);
    }
    app.send('menu', {
      action: 'update',
      id: `${deny ? this.black : this.white}${site ? '_site' : ''}`,
      title: app.i10n(
        `${id ? 'remove' : 'add'}_${deny ? this.black : this.white}${
          site ? '_site' : ''
        }`
      ),
    });
  }
}

window.definePlugin(table, Plugin);
