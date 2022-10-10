import noop from '@/utils/noop';
import { tables } from '@/service';
import { isFunction } from '@/utils/is';
import DB, { Query, Pager } from '@/core/db.class';

const db = new DB({
  tables,
  name: 'cc',
  version: 6,
});

type Option = {
  table: string;
  action: string;
  name: string;
  value?: any;
  query?: Query;
  pager?: Pager;
};

type Callback = (error?: any, data?: any) => void;

export default function (callback: Option | Callback, option?: Option) {
  const app = this;
  const notPromise = isFunction(callback);
  const cb = (notPromise ? callback : noop) as Callback;
  const opts = (notPromise ? option : callback) as Option;
  const table = opts.table || 'setting';

  switch (opts.action) {
    case 'query':
      db
        // @ts-ignore
        .query(table, opts.query, opts.pager)
        .then((data) => {
          cb(null, data);
        })
        .catch((error) => {
          cb(error);
        });
      break;
    case 'queryCount':
      db
        // @ts-ignore
        .queryCount(table, opts.query)
        .then((data) => {
          cb(null, data);
        })
        .catch((error) => {
          cb(error);
        });
      break;
    case 'get':
      db.get(table, opts.name)
        .then((data) => {
          cb(null, data);
        })
        .catch((error) => {
          cb(error);
        });
      break;
    case 'all':
      db.getAll(table)
        .then((data) => {
          cb(null, data);
        })
        .catch((error) => {
          cb(error);
        });
      break;
    case 'remove':
      return db
        .delete(table, opts.name)
        .then(() => {
          cb();
        })
        .catch((error) => {
          cb(error);
        });
    case 'clear':
      return db
        .clear(table)
        .then(() => {
          cb();
        })
        .catch((error) => {
          cb(error);
        });
    case 'add':
      db.set(table, opts.value)
        .then((data) => {
          cb(null, data);
        })
        .catch((error) => {
          cb(error);
        });
      break;
    case 'deleteMultiple':
      db.deleteMultiple(table, opts.value)
        .then(() => {
          cb();
        })
        .catch((error) => {
          cb(error);
        });
      break;
    case 'setMultiple':
      db.setMultiple(table, opts.value)
        .then((data) => {
          cb(null, data);
        })
        .catch((error) => {
          cb(error);
        });
      break;
    default:
      return cb(app.i10n('empty'));
  }
}
