import Table from './includes/class.table';

export default function(app){
  const optionTable = new Table('option');
  const pluginTable = new Table('plugin');

  app.addAction('option', function(callback, { request }){
    const name = request.name;
    const option = request.value;
    switch(request.execute){
      case 'get':
        optionTable.get(name, callback);
        break;
      case 'remove':
        optionTable.remove(name, callback);
        break;
      case 'add':
        optionTable.add(name, option, callback);
        break;
      case 'all':
        optionTable.all(callback);
        break;
      case 'theme':
        optionTable.get('theme', (error, theme = {}) => {
          if(error){
            callback(error);
            return;
          }
          if(utils.isUndefined(option) && !utils.isPlainObject(name)){
            if(utils.isUndefined(name)){
              callback(null, theme);
            } else {
              callback(null, theme[name]);
            }
          } else {
            const newTheme = Object.assign(theme, utils.isPlainObject(name) ? name : {[name]: option});
            optionTable.add('theme', newTheme, error => {
              callback(error, newTheme);
            });
          }
        });
        break;
      default:
        callback('not find action');
    }
  });
  app.addAction('plugin', function(callback, { request, sender }){
    let cachePlugin;
    const name = request.name;
    const plugin = request.value;
    switch(request.execute){
      case 'get':
        pluginTable.get(name, callback);
        break;
      case 'count':
        pluginTable.count(callback);
        break;
      case 'remove':
        pluginTable.remove(name, callback, () => {
          delete app._cache.plugins[name];
        });
        break;
      case 'add':
        pluginTable.add(name, plugin, callback, () => {
          app._cache.plugins[name] = plugin;
        });
        break;
      case 'all':
        pluginTable.all(callback);
        break;
      case 'load':
        // 内置 react 模块单独处理
        if(['react'].includes(name)){
          api.tabs.executeScript(sender.tab.id, {
            file: `assets/js/${name}.js`,
            allFrames: false,
            matchAboutBlank: false,
            runAt: 'document_idle',
          }, function(){
            callback(null, name);
          });
        } else {
          cachePlugin = app._cache.plugins[name];
          if(cachePlugin){
            callback(null, cachePlugin);
            cachePlugin.js && api.tabs.executeScript(sender.tab.id, {
              code: cachePlugin.js,
              allFrames: false,
              matchAboutBlank: false,
              runAt: 'document_idle',
            });
          } else {
            pluginTable.get(name, (error, data = {}) => {
              if(error){
                callback(error);
                return;
              }
              // 缓存插件
              app._cache.plugins[name] = data;
              callback(null, data);
              data.js && api.tabs.executeScript(sender.tab.id, {
                code: data.js,
                allFrames: false,
                matchAboutBlank: false,
                runAt: 'document_idle',
              });
            })
          }
        }
        break;  
      default:
        callback('not find action');
    }
  });
  app.addAction('reset-theme', function(callback){
    const defaultTheme = {
      width:"680px",
      indent:'0em',
      size:'20px',
      spacing:0,
      blockspacing:'32px',
      align:'left',
      font:'default',
      lineheight:'1.8',
    };
    optionTable.add('theme', defaultTheme, function(){
      callback && callback(null, defaultTheme);
    });
  });
  app.addAction('fetch', function(callback, { request }){
    api.fetch(request.url, function(error, data){
      callback(error, data);
    }, request.type);
  });
  app.addAction('open-option-page', function(){
    api.runtime.openOptionsPage();
  });
  app.addAction('cc-active', function(callback, { sender }){
    app.change(sender.tab.id, function(){
      callback(null);
    }, 'active');
  });
  app.addAction('cc-inactive', function(callback, { sender }){
    app.change(sender.tab.id, function(){
      callback(null);
    }, 'enable');
  });
  app.addAction('cc-enable', function(callback, { sender }){
    app.change(sender.tab.id, function(){
      callback(null);
    }, 'enable', 'enable');
  });
  app.addAction('cc-disable', function(callback, { sender }){
    app.change(sender.tab.id, function(){
      callback(null);
    }, 'disable', 'disable');
  });
  // 无法嵌入的网页去除限制响应头
  api.webRequest.onHeadersReceived.addListener(function(details){
    return {responseHeaders: details.responseHeaders.filter(header => ['content-security-policy', 'x-frame-options'].indexOf(header.name.toLowerCase()) < 0)};
  }, { urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);
  api.browserAction.onClicked.addListener(tab => {
    api.tabs.sendMessage(tab.id, {
      action: 'browserAction-click',
    });
  });
  api.tabs.onUpdated.addListener(function(tabId, changeInfo){
    if(changeInfo.url){
      api.tabs.sendMessage(tabId, {
        action: 'url-change',
        url: changeInfo.url,
      });
    }
  });
  api.contextMenus.create({
    title: 'Circle 阅读模式',
    id: 'circle',
  });
  api.contextMenus.create({
    title: '聚焦模式',
    parentId:'circle',
    id: 'circle-focus',
    onclick: (info, tab) => {
      if(info.pageUrl.startsWith('chrome')){
        return;
      }
      api.tabs.sendMessage(tab.id, {
        action: 'circle-focus',
      });
    },
  });
  api.runtime.onInstalled.addListener(details => {
    if(details.reason !== 'install') {
      return;
    }    
    app.doAction('analytics-click', () => {}, {event: 'install'});
    // 写入初始主题
    optionTable.add('theme', {
      preset:'light',
      custom: {
        'color-red':27,
        'color-green':27,
        'color-blue':27,
        'linkcolor-red':65,
        'linkcolor-green':110,
        'linkcolor-blue':210,
        'bgcolor-red':255,
        'bgcolor-green':255,
        'bgcolor-blue':255,
      }
    });
    api.runtime.setUninstallURL('https://ranhe.xyz/circle-uninstall', function(){
      app.doAction('analytics-click', () => {}, {event: 'uninstall'});
    });
    app.doAction('open-option-page');
  });
}
