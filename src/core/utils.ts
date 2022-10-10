import unix from '@/utils/unix';
import { Query, Pager } from '@/core/db.class';
import { isString, isObject, isUndefined } from './is';

export type Option = {
  name?: string;
  action?: string;
  value?: any;
  pager?: Pager;
  query?: Query;
  skip?: boolean;
  table?: string;
  origin?: boolean;
};

export function option(data: string | Option, app: any, client?: boolean) {
  let opts: Option = {};
  if (isString(data)) {
    // @ts-ignore
    opts.name = data;
  } else {
    // @ts-ignore
    opts = data;
  }
  return new Promise<any>((resolve, reject) => {
    let query = {};
    const table = opts.table || 'setting';
    let cb = (error: string, data: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(!opts.origin && data && data.items ? data.items : data);
      }
    };
    if (opts.action) {
      query = {
        table,
        action: opts.action,
        value:
          !opts.skip &&
          opts.action === 'setMultiple' &&
          Array.isArray(opts.value)
            ? opts.value.map((item) =>
                item.changed ? item : { ...item, changed: unix() }
              )
            : opts.value,
      };
    } else if (isString(opts.value) && opts.value.startsWith('query')) {
      query = {
        table,
        action: opts.value,
        query: opts.query,
        pager: opts.pager,
      };
    } else if (isUndefined(opts.name) && isUndefined(opts.value)) {
      query = {
        table,
        action: 'all',
      };
    } else if (isUndefined(opts.value)) {
      query = { table, action: 'get', name: opts.name };
      cb = (error: string, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            !opts.origin && data && !isUndefined(data.value) ? data.value : data
          );
        }
      };
    } else if (opts.value === 'clear') {
      query = { table, action: 'clear' };
      cb = (error?: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      };
    } else if (opts.value === 'remove') {
      query = { table, action: 'remove', name: opts.name };
      cb = (error: string, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      };
    } else {
      cb = (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      };
      // 设置保留 nid
      const changed = unix();
      let valueToUpdate: any = {
        changed,
        id: opts.name,
      };
      if (isObject(opts.value)) {
        valueToUpdate = {
          ...valueToUpdate,
          ...opts.value,
          // 返回的数据含有日期
          changed,
        };
      } else {
        valueToUpdate.value = opts.value;
      }
      if (client) {
        app.send(
          'db',
          { table, action: 'get', name: opts.name },
          (error: string, data: any) => {
            if (!error && data && data.nid) {
              valueToUpdate.nid = data.nid;
            }
            app.send(
              'db',
              {
                table,
                action: 'add',
                value: valueToUpdate,
              },
              cb
            );
          }
        );
      } else {
        app.fire(
          'db',
          (error: string, data: any) => {
            if (!error && data && data.nid) {
              valueToUpdate.nid = data.nid;
            }
            app.fire('db', cb, {
              table,
              action: 'add',
              value: valueToUpdate,
            });
          },
          { table, action: 'get', name: opts.name }
        );
      }
      return;
    }
    if (client) {
      app.send('db', query, cb);
    } else {
      app.fire('db', cb, query);
    }
  });
}

export function query(url: string, options: any, app: any, client?: boolean) {
  let format = 'json';
  if (options && options.format) {
    format = options.format;
    delete options.format;
  }
  return new Promise<any>((resolve, reject) => {
    const query = {
      url,
      format,
      options,
    };
    const cb = (error?: string, data?: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    };
    if (client) {
      app.send('fetch', query, cb);
    } else {
      app.fire('fetch', cb, query);
    }
  });
}
