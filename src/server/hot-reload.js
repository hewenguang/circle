let timer;
const cache = {};

function watchChanges(dir, lastDir){
  lastDir.createReader().readEntries(function(entries){
    entries.forEach(function(item){
      if(item.isDirectory){
        return watchChanges(dir, item);
      } else {
        item.getMetadata(function({ size, modificationTime }){
          const unique = `${size}${modificationTime}`;
          const path = item.fullPath.replace('/crxfs/', '');
          !cache[path] && (cache[path] = unique);
          if(cache[path] !== unique && !path.startsWith('option/') && item.name !== 'manifest.json'){
            cache[path] = unique;
            console.log(path);
            reload(item, path);
          }
        });
      }
    });
    timer && clearTimeout(timer);
    timer = setTimeout(() => watchChanges(dir, dir), 2000);
  });
}

const reload = (entry, url = '') => {
  if(entry && url.startsWith('plugins')){
    entry.file(item => {
      const info = item.name.split('.');
      const name = info[0];
      const suffix = info[1];
      const reader = new FileReader();
      reader.onloadend = function(){
        app.db.get('plugin', name, (error, plugin = {}) => {
          if(error){
            console.error(error);
            return;
          }
          app.doAction('plugin', function(error){
            error && console.log(error);
            api.tabs.query({ active: true, currentWindow: true }, tabs => {
              if(tabs[0]){
                api.tabs.reload(tabs[0].id);
              }
            });
          }, {
            request: {
              name,
              execute: 'add',
              value: Object.assign(plugin, {
                name,
                version: '0.0.0',
                // type: 'render',
                [suffix]: this.result,
              }),
            }
          });
        });
      };
      reader.readAsText(item);
    });
  } else {
    api.runtime.reload();
    api.tabs.query({ active: true, currentWindow: true }, tabs => {
      if(tabs[0]){
        api.tabs.reload(tabs[0].id);
      }
    });
  }
};

chrome.management.getSelf(self => {
  if (self.installType === 'development') {
    api.runtime.getPackageDirectoryEntry(dir => watchChanges(dir, dir));
  }
});
