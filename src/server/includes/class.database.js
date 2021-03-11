export default class Database{
  constructor(name, tables = []){
    this._indexedDB = window.indexedDB || window.webkitindexedDB;
    this._version = 1;
    this._name = name;
    this._tables = tables;
    this._db = null;
  }

  _check(callback){
    if(this._db){
      callback && callback(null, this._db);
      return;
    }
    const request = this._indexedDB.open(this._name, this._version);
    request.onsuccess = event => {
      this._db = event.target.result;
      callback && callback(null, this._db);
    };
    request.onupgradeneeded = event => {
      const database = event.target.result;
      utils.each(this._tables, table => {
        if (!database.objectStoreNames.contains(table)) {
          database.createObjectStore(table, { autoIncrement: true });
        }
      });
    };
    request.onerror = event => {
      callback && callback(event);
    }
  }

  action(table, action, mode, callback, name, value) {
    this._check((error, db) => {
      if(error){
        console.error(error);
        return;
      }
      const store = db.transaction([table], mode).objectStore(table);
      const request = utils.isUndefined(value) ? store[action](name) : store[action](value, name);
      request.onsuccess = () => {
        callback && callback(null, request.result);
      };
      request.onerror = error => {
        callback && callback(error);
      }
    });
  }

  set(table, name, value, callback) {
    this.action(table, 'put', 'readwrite', callback, name, value);
  }

  get(table, name, callback) {
    this.action(table, 'get', 'readonly', callback, name);
  }

  getAll(table, callback) {
    this._check((error, db) => {
      if(error){
        console.error(error);
        return;
      }
      const store = db.transaction([table], 'readonly').objectStore(table);
      const cursor = store.openCursor();
      const results = {};
      cursor.onsuccess = function(event){
        const result = event.target.result;
        if (result) {
          results[result.key] = result.value;
          result.continue();
        } else {
          callback && callback(null, results);
        }
      }
      cursor.onerror = error => {
        callback && callback(error);
      }
    });
  }

  key(table, name, callback) {
    this.action(table, 'getKey', 'readonly', callback, name);
  }

  keys(table, callback) {
    this.action(table, 'getAllKeys', 'readonly', callback);
  }

  count(table, callback, name){
    this.action(table, 'count', 'readonly', callback, name);
  }

  delete(table, name, callback) {
    this.action(table, 'delete', 'readwrite', callback, name);
  }

  clear(table, callback) {
    this.action(table, 'clear', 'readwrite', callback);
  }

  destory(){
    this._db && this._db.close();
    this._indexedDB && this._indexedDB.deleteDatabase(this._name);
  }
}
