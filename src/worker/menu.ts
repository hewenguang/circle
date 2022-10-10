import log from '@/log';
import sort from '@/utils/sort';
import each from '@/utils/each';

type ctxItem = {
  id?: string;
  title?: string;
  create?: string;
  checked?: boolean;
};

function all(app: any, callback: (error: any, data?: any) => void) {
  app
    .option({ table: 'menu' })
    .then((data = []) => {
      const items: ctxItem[] = [];
      each(data, function (item, key) {
        if (!item.checked) {
          return;
        }
        items.push({
          id: key,
          ...item,
        });
      });
      callback && callback(null, sort(items));
    })
    .catch(callback);
}

export default function (
  callback: (error?: string, data?: any) => void,
  {
    id,
    title,
    enabled,
    action,
  }: {
    id: string;
    action: string;
    title: string;
    enabled?: boolean;
  }
) {
  const app = this;
  app.option('plugin').then((plugin: string[]) => {
    if (!Array.isArray(plugin) || !plugin.includes('menu')) {
      app.contextMenus.removeAll(callback);
      return;
    }
    switch (action) {
      case 'create':
        app
          .option({ name: id, table: 'menu', origin: true })
          .then((data: any = {}) => {
            if (!data.checked) {
              callback && callback();
              return;
            }
            app.contextMenus.create({ id: id, title }, function () {
              callback && callback();
              if (app.runtime.lastError) {
                console.log(app.runtime.lastError);
              }
            });
          })
          .catch(callback);
        break;
      case 'update':
        app
          .option({
            name: id,
            table: 'menu',
            origin: true,
          })
          .then((data: any = {}) => {
            if (!data.checked) {
              callback && callback();
              return;
            }
            if (id && title) {
              app.contextMenus.update(id, { title, enabled }, callback);
            } else {
              log(`${id} miss ${title}`);
            }
          })
          .catch(callback);
        break;
      case 'remove':
        app
          .option({
            name: id,
            table: 'menu',
            origin: true,
          })
          .then((data: any = {}) => {
            if (data.checked) {
              return;
            }
            app.contextMenus.remove(id, callback);
          })
          .catch(callback);
        break;
      case 'destory':
        app.contextMenus.removeAll(callback);
        break;
      case 'start':
        all(app, function (error: string, items: ctxItem[]) {
          if (error) {
            callback && callback(error);
            return;
          }
          callback && callback();
          let counter = items.length;
          if (counter <= 0) {
            return;
          }
          app.contextMenus.removeAll(function () {
            each(items, function (item) {
              item.checked &&
                app.contextMenus.create({
                  id: item.id,
                  title: item.title,
                  enabled,
                });
            });
          });
        });
        break;
    }
  }, callback);
}
