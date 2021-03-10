import * as utils from './utils';

export default class API{
  constructor() {
    utils.each(['alarms','bookmarks','browserAction','commands','contextMenus','cookies','downloads','events','extension','extensionTypes','history','i18n','idle','notifications','pageAction','runtime','storage','tabs','webNavigation','webRequest', 'windows'], item => {
      this[item] = chrome[item];
    });
  }

  fetch(url, callback, type = 'json'){
    fetch(url).then(response => response[type]()).then(result => {
      callback && callback(null, result);
    }).catch(error => {
      callback && callback(error.message);
    });
  }

  listen(callback){
    this.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if(utils.isFunction(callback)){
        return callback(request, sender, response => {
          sendResponse(response);
        });
      }
      return true;
    });
  }

  send(action, opts, callback){
    const option = utils.isPlainObject(opts) ? opts : {};
    const cb = utils.isFunction(opts) ? opts : callback;
    this.runtime.sendMessage(this.runtime.id, Object.assign(option, { action }), (...args) => {
      utils.isFunction(cb) && cb.apply(null, args);
    });
  }
}
