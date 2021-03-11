import * as dom from './dom';

window.dom = dom;

export default class Client extends App {
  constructor(){
    super();
    // 加载的插件
    this._plugins = [];
    // 缓存数据
    this._cache = {
      // 当前主题设置
      theme: {},
    };
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
    this.bindEvents();
  }

  bindEvents(){
    let keyMap = {};
    // 快捷键绑定
    document.addEventListener('keyup', event => {
      const keyCode = event.keyCode || event.which;
      !utils.isNumber(keyMap[keyCode]) && (keyMap[keyCode] = 0);
      keyMap[keyCode]++;
      keyMap[keyCode] >= 2 && this.doAction('double-keyup', keyCode);
      setTimeout(function(){keyMap = {}}, 500);
      this.doAction('keyup', keyCode);
    });
  }

  loadPlugin(name, callback){
    if(this._plugins.includes(name)){
      callback && callback(name);
      app.doAction(`load-plugin-${name}`);
    } else {
      api.send('plugin', { execute: 'load', name }, ({error}) => {
        if(error){
          this.doAction('error', error);
          return;
        }
        this._plugins.push(name);
        callback && callback(name);
        app.doAction(`load-plugin-${name}`);
      });
    }
  }
}
