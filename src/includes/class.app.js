import * as utils from './utils';

export default class Hook {
  constructor() {
    this._hooks = {};
  }

  addAction(name, callback, priority){
    this.addFilter(name, callback, priority);
  }

  removeAction(name, callback){
    this.removeFilter(name, callback);
  }

  hasAction(name){
    return this.hasFilter(name);
  }

  doAction(...args){
    this.applyFilter.apply(this, args);
  }

  addFilter(name, callback, priority = 10){
    if (!utils.isString(name) || !utils.isFunction(callback) || !utils.isNumber(priority)) {
      return;
    }
    !utils.isArray(this._hooks[name]) && (this._hooks[name] = []);
    let insertIndex = 0;
    utils.each(this._hooks[name], (item, index) => {
      if(item.priority <= priority){
        insertIndex = index;
        return false;
      }
    });
    this._hooks[name].splice(insertIndex, 0, callback);
  }

  removeFilter(name, callback){
    if(!utils.isString(name)){
      return;
    }
    if(!this.hasFilter(name)){
      return;
    }
    const removeCallback = utils.isFunction(callback);
    if (removeCallback) {
      utils.each(this._hooks[name], (item, index) => {
        if(item === callback){
          this._hooks[name].splice(index, 1);
        }
      });
    } else {
      this._hooks[name] = [];
    }
  }

  hasFilter(name){
    if(!utils.isString(name)){
      return;
    }
    return !!this._hooks[name];
  }

  applyFilter(name, ...args){
    if(!utils.isString(name)){
      return;
    }
    if(!this.hasFilter(name)){
      return args[0];
    }
    utils.each(this._hooks[name], item => {
      const returnValue = item.apply(this, args);
      if(!utils.isUndefined(returnValue)){
        args[0] = returnValue;
      }
    });
    return args[0];
  }
}
