import { fetch } from './index';
import { add, getAll } from './table';

export function getRemotePlugin(){
  return new Promise(function(resolve, reject){
    fetch(window.url).then(result => {
      resolve(result);
    }).catch(reject);
  });
}

export function installPlugin(plugin){
  return new Promise(function(resolve, reject){
    const { name, type, js, css } = plugin;
    if(!name || !type){
      reject('invaild plugin');
      return;
    }
    if(js){
      fetch(js, 'text').then(jsCode => {
        if(css){
          fetch(css, 'text').then(cssCode => {
            add('plugin', name, Object.assign({}, plugin, { js: jsCode, css: cssCode })).then(resolve).catch(reject);
          }).catch(reject);
        } else {
          add('plugin', name, Object.assign({}, plugin, { js: jsCode })).then(resolve).catch(reject);
        }
      }).catch(reject);
    } else {
      add('plugin', name, plugin).then(resolve).catch(reject);
    }
  });
}

export function updatePlugins(plugins, callback, progress){
  const plugin = plugins.pop();
  if(!plugin){
    callback();
    return;
  }
  progress && progress(plugins.length);
  installPlugin(plugin).then(() => {
    updatePlugins(plugins, callback, progress);
  }).catch(error => {
    callback(error);
  });
}

export function checkPlugin(){
  return new Promise(function(resolve, reject){
    getAll('plugin').then(plugins => {
      getRemotePlugin().then(remotes => {
        const lists = [];
        (remotes.data || []).forEach(item => {
          const match = plugins[item.name];
          (match && match.version != item.version) && lists.push(item);
        });
        resolve(lists);
      }).catch(reject);
    }).catch(reject);
  });
}
