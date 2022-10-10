import each from '@/utils/each';
import ArrayInArray from '@/utils/array-in-array';
import { isUndefined, isBoolean, isNumber } from '@/utils/is';

type Option = {
  name: string;
  version: number;
  tables: Array<{
    table: string;
    indexs: Array<string>;
  }>;
};

type Match = {
  [index: string]: string | boolean | Array<string>;
};

export type Query = {
  field: string;
  keyRange?: any | Array<any>;
  searchIn?: string | Array<string>;
  search?: string;
  order?: 'DESC' | 'ASC';
  match?: Match;
};

export type Pager = {
  start: number;
  limit: number;
};

export default class DB {
  private instance: any;
  private options: Option;

  constructor(options: Option) {
    this.instance = null;
    this.options = options;
  }

  private ensure() {
    return new Promise((resolve, reject) => {
      if (this.instance) {
        return resolve(this.instance);
      }
      const { name, version, tables } = this.options;
      const request = indexedDB.open(name, version);
      request.onsuccess = (event: any) => {
        this.instance = event.target.result;
        resolve(this.instance);
      };
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        tables.forEach(({ table, indexs }) => {
          if (!db.objectStoreNames.contains(table)) {
            const store = db.createObjectStore(table, { keyPath: 'id' });
            Array.isArray(indexs) &&
              indexs.forEach((index) => {
                store.createIndex(index, index, { unique: false });
              });
          }
        });
      };
      request.onerror = (event: any) => {
        reject(event);
      };
    });
  }

  action(
    table: string,
    mode: string,
    action: string,
    value?: any,
    name?: string
  ) {
    return this.ensure().then(
      (db: any) =>
        new Promise((resolve, reject) => {
          const store = db.transaction([table], mode).objectStore(table);
          let request: any;
          if (isUndefined(value) && isUndefined(name)) {
            request = store[action]();
          } else if (isUndefined(name)) {
            request = store[action](value);
          } else {
            request = store[action](name);
          }
          request.onsuccess = (event: any) => {
            resolve(event.target.result);
          };
          request.onerror = function (error: any) {
            reject(error);
          };
        })
    );
  }

  get(table: string, key: string) {
    return this.action(table, 'readonly', 'get', key);
  }

  private getRange(range: any | Array<any>) {
    let keyRange;
    if (Array.isArray(range)) {
      if (range[0] === 'gt') {
        keyRange = IDBKeyRange.lowerBound(range[1], true);
      } else if (range[0] === 'lt') {
        keyRange = IDBKeyRange.upperBound(range[1], true);
      } else if (range[0] === 'ge') {
        keyRange = IDBKeyRange.lowerBound(range[1]);
      } else if (range[0] === 'le') {
        keyRange = IDBKeyRange.upperBound(range[1]);
      } else {
        keyRange = IDBKeyRange.bound(range[0], range[1]);
      }
    } else {
      keyRange = range === 'all' ? null : IDBKeyRange.only(range);
    }
    return keyRange;
  }

  private searched(
    item: any,
    searchIn: string | Array<string>,
    search: Array<string>
  ) {
    let find = false;
    each(search, (keyword: string) => {
      each(Array.isArray(searchIn) ? searchIn : [searchIn], (searchInItem) => {
        if (item[searchInItem] && item[searchInItem].indexOf(keyword) >= 0) {
          find = true;
          return find;
        }
        return;
      });
      if (find) {
        return find;
      }
      return;
    });
    return find;
  }

  private matched(item: any, match: Match) {
    let miss = false;
    each(match, (value, field) => {
      const current = item[field];
      if (isBoolean(value)) {
        if (!isBoolean(current)) {
          miss = true;
          return miss;
        }
        if (value && !current) {
          miss = true;
          return miss;
        }
        if (!value && current) {
          miss = true;
          return miss;
        }
      } else if (['empty', 'defined'].includes(value)) {
        if (
          value === 'empty' &&
          (Array.isArray(current) ? current.length > 0 : !!current)
        ) {
          miss = true;
          return miss;
        } else if (
          value === 'defined' &&
          (Array.isArray(current) ? current.length <= 0 : !current)
        ) {
          miss = true;
          return miss;
        }
      } else if (Array.isArray(value)) {
        if (!current) {
          miss = true;
          return miss;
        }
        if (isNumber(current)) {
          if (
            value.length === 2 &&
            (current > value[1] || current < value[0])
          ) {
            miss = true;
            return miss;
          }
        } else if (Array.isArray(current)) {
          if (!ArrayInArray(value, current)) {
            miss = true;
            return miss;
          }
        }
      }
      return;
    });
    return !miss;
  }

  query(table: string, query: Query, pager: Pager = { start: 0, limit: 0 }) {
    return this.ensure().then(
      (db: any) =>
        new Promise((resolve, reject) => {
          const store = db.transaction([table], 'readonly').objectStore(table);
          const index = store.index(query.field);
          if (query.keyRange) {
            const request = index.openCursor(
              this.getRange(query.keyRange),
              query.order && query.order === 'ASC' ? 'next' : 'prev'
            );
            let first = true;
            let items: Array<any> = [];
            request.onsuccess = (event: any) => {
              const cursor = event.target.result;
              if (cursor) {
                if (first) {
                  first = false;
                  items = [];
                  pager.limit > 0 &&
                    pager.start > pager.limit &&
                    cursor.advance(pager.start - 1);
                }
                if (
                  pager.limit <= 0 ||
                  (pager.limit > 0 && items.length < pager.limit)
                ) {
                  const item = cursor.value;
                  if (query.match && Object.keys(query.match).length > 0) {
                    if (this.matched(item, query.match)) {
                      if (query.searchIn && query.search) {
                        const search = query.search.split(',');
                        search.length > 0 &&
                          this.searched(item, query.searchIn, search) &&
                          items.push(item);
                      } else {
                        items.push(item);
                      }
                    }
                  } else {
                    if (query.searchIn && query.search) {
                      const search = query.search.split(',');
                      search.length > 0 &&
                        this.searched(item, query.searchIn, search) &&
                        items.push(item);
                    } else {
                      items.push(item);
                    }
                  }
                }
                cursor.continue();
              } else {
                const countRequest = index.count();
                countRequest.onsuccess = (event: any) => {
                  resolve({
                    items,
                    start: pager.start,
                    limit: pager.limit,
                    total: event.target.result,
                    search: query.search || '',
                  });
                };
                countRequest.onerror = function () {
                  resolve({
                    items,
                    start: pager.start,
                    limit: pager.limit,
                    total: 0,
                    search: query.search || '',
                  });
                };
              }
            };
            request.onerror = function (error: any) {
              reject(error);
            };
          } else {
            const request = index.getAll();
            request.onsuccess = (event: any) => {
              const items = event.target.result;
              resolve({
                items,
                total: items.length,
                start: pager.start,
                limit: pager.limit,
                search: query.search || '',
              });
            };
            request.onerror = function (error: any) {
              reject(error);
            };
          }
        })
    );
  }

  queryCount(table: string, query: Query) {
    return this.ensure().then(
      (db: any) =>
        new Promise((resolve, reject) => {
          const store = db.transaction([table], 'readonly').objectStore(table);
          const index = store.index(query.field);
          if (query.keyRange) {
            const request = index.openCursor(
              this.getRange(query.keyRange),
              query.order && query.order === 'ASC' ? 'next' : 'prev'
            );
            let count: number = 0;
            request.onsuccess = (event: any) => {
              const cursor = event.target.result;
              if (cursor) {
                const item = cursor.value;
                if (query.match && Object.keys(query.match).length > 0) {
                  if (this.matched(item, query.match)) {
                    if (query.searchIn && query.search) {
                      const search = query.search.split(',');
                      search.length > 0 &&
                        this.searched(item, query.searchIn, search) &&
                        count++;
                    } else {
                      count++;
                    }
                  }
                } else {
                  if (query.searchIn && query.search) {
                    const search = query.search.split(',');
                    search.length > 0 &&
                      this.searched(item, query.searchIn, search) &&
                      count++;
                  } else {
                    count++;
                  }
                }
                cursor.continue();
              } else {
                resolve(count);
              }
            };
            request.onerror = function (error: any) {
              reject(error);
            };
          } else {
            const request = index.count();
            request.onsuccess = (event: any) => {
              resolve(event.target.result);
            };
            request.onerror = function (error: any) {
              reject(error);
            };
          }
        })
    );
  }

  set(table: string, value: any) {
    return this.action(table, 'readwrite', 'put', value);
  }

  setMultiple(table: string, values: Array<any>) {
    return this.ensure().then(
      (db: any) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction([table], 'readwrite');
          const store = transaction.objectStore(table);
          values.forEach((value) => {
            store.put(value);
          });
          transaction.oncomplete = function (event: any) {
            resolve(event.target.result);
          };
          transaction.onerror = function (error: any) {
            reject(error);
          };
        })
    );
  }

  delete(table: string, name: string) {
    return this.action(table, 'readwrite', 'delete', name);
  }

  deleteMultiple(
    table: string,
    values: Array<{ id: string | number; nid: string | number }>
  ) {
    return this.ensure().then(
      (db: any) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction([table], 'readwrite');
          const store = transaction.objectStore(table);
          values.forEach((value) => {
            store.delete(value.id);
          });
          transaction.oncomplete = function (event: any) {
            resolve(event.target.result);
          };
          transaction.onerror = function (error: any) {
            reject(error);
          };
        })
    );
  }

  getAll(table: string) {
    return this.action(table, 'readonly', 'getAll');
  }

  clear(table: string) {
    return this.action(table, 'readwrite', 'clear');
  }
}
