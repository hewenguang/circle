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
