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
    fetch('https://ranhe.xyz/api/plugins_v3.json').then(result => {
      resolve(result);
    }).catch(reject);
  });
}
