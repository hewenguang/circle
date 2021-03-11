import Table from './includes/class.table';
import { defaultTheme } from './config';

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
            cachePlugin.css && api.tabs.insertCSS(sender.tab.id, {
              code: cachePlugin.css,
              allFrames: false,
              matchAboutBlank: false,
              runAt: 'document_idle',
            });
            cachePlugin.js && api.tabs.executeScript(sender.tab.id, {
              code: cachePlugin.js,
              allFrames: false,
              matchAboutBlank: false,
              runAt: 'document_idle',
            });
            callback();
          } else {
            pluginTable.get(name, (error, data = {}) => {
              if(error){
                callback(error);
                return;
              }
              // 缓存插件
              app._cache.plugins[name] = data;
              data.css && api.tabs.insertCSS(sender.tab.id, {
                code: data.css,
                allFrames: false,
                matchAboutBlank: false,
                runAt: 'document_idle',
              });
              data.js && api.tabs.executeScript(sender.tab.id, {
                code: data.js,
                allFrames: false,
                matchAboutBlank: false,
                runAt: 'document_idle',
              });
              callback();
            });
          }
        }
        break;  
      default:
        callback('not find action');
    }
  });
  app.addAction('reset-theme', function(callback){
    optionTable.add('theme', defaultTheme, callback);
  });
  app.addAction('write-version', function(callback){
    const manifest = api.runtime.getManifest();
    const version = manifest.version;
    optionTable.add('version', version, callback);
  })
  api.runtime.onInstalled.addListener(details => {
    app.doAction('analytics-click', () => {}, {request:{event: details.reason}});
    // if (details.reason === 'update') {
    //   optionTable.remove('version', function(){
    //     app.doAction('open-option-page');
    //   });
    // }
    if(details.reason !== 'install') {
      return;
    }
    // 写入初始主题
    optionTable.add('theme', Object.assign(defaultTheme, {
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
    }));
    api.runtime.setUninstallURL('https://ranhe.xyz/circle-uninstall');
    app.doAction('open-option-page');
  });
}
