import API from 'src/includes/class.api';
import App from 'src/includes/class.app';
import * as utils from 'src/includes/utils';
import Database from './class.database';

window.api = new API;
window.utils = utils;

export default class Server extends App{
  constructor(cfgs){
    super();
    this._cache = {
      plugins: {},
    };
    this._options = cfgs;
    this.db = new Database(this._options.database.name, this._options.database.tables);
  }

  init(){
    api.listen((request, sender, fn) => {
      const { action } = request;
      if(!action){
        fn({error: 'action invalid'});
      } else {
        this.doAction(action, (error, data) => {
          fn({error, data});
        },{
          sender,
          request,
        });
      }
      return true;
    });
  }

  change(tabId, callback, color, action){
    ['enable', 'disable'].includes(action) && api.browserAction[action](tabId);
    ['enable', 'disable', 'active'].includes(color) && api.browserAction.setIcon({
      tabId,
      path: {
        16: `assets/icon/16/${color}.png`,
        32: `assets/icon/32/${color}.png`,
      },
    });
    callback && callback();
  }
}
