import { fetch } from './index';
import { add } from './table';

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
