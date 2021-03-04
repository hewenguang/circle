export default class Table {
  constructor(name){
    this.name = name;
  }

  count(callback){
    app.db.count(this.name, (error, data) => {
      if(error){
        callback(error);
        return;
      }
      callback(null, data);
    });
  }

  get(name, callback){
    app.db.get(this.name, name, (error, data) => {
      if(error){
        callback(error);
        return;
      }
      callback(null, data);
    });
  }

  remove(name, callback, success){
    app.db.delete(this.name, name, (error, data) => {
      if(error){
        callback(error);
        return;
      }
      success && success(name);
      callback(null, data);
    });
  }

  add(name, value, callback, success){
    app.db.set(this.name, name, value, error => {
      if(error){
        callback && callback(error);
        return;
      }
      success && success();
      callback && callback(null, value);
    });
  }

  all(callback){
    app.db.getAll(this.name, (error, value) => {
      if(error){
        callback(error);
        return;
      }
      callback(null, value);
    });
  }
}
