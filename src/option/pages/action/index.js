export function fetch(url, type){
  return new Promise(function(resolve, reject){
    api.send('fetch', { url, type }, function({error, data}){
      if(error){
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

export function getPlugins(){
  return new Promise(function(resolve, reject){
    fetch('https://hewenguang.github.io/circle/api/plugins.json').then(result => {
      resolve(result);
    }).catch(reject);
  });
}

export function getVersion(){
  return new Promise(function(resolve, reject){
    fetch('https://hewenguang.github.io/circle/api/version.json').then(result => {
      resolve(result.data);
    }).catch(reject);
  });
}
