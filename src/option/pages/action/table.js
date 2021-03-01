export function add(table, name, value){
  return new Promise(function(resolve, reject){
    api.send(table, {
      name,
      value,
      execute: 'add',
    }, function({error}){
      if(error){
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}

export function get(table, name){
  return new Promise(function(resolve, reject){
    api.send(table, { execute: 'get', name }, function({error, data}){
      if(error){
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

export function getAll(table){
  return new Promise(function(resolve, reject){
    api.send(table, {execute: 'all'}, function({error, data = []}){
      if(error){
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
