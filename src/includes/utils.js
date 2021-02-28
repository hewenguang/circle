export function isUndefined(value){
  return typeof value === 'undefined';
}

export function isString(value){
  return typeof value === 'string';
}

export function isNumber(value){
  return typeof value === 'number';
}

export function isBoolean(value){
  return typeof value === 'boolean';
}

export function isArray(value){
  return Array.isArray(value);
}

export function isFunction(value){
  return typeof value === 'function' && value instanceof Function;
}

export function isElement(value){
  return value && value.nodeType === 1 && !isPlainObject(value);
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isPlainObject(value) {
  if (!value || typeof value !== 'object' || ({}).toString.call(value) != '[object Object]' ) {
      return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
}

export function toLower(value){
  return isString(value) ? value.toLowerCase() : '';
}

export function each(value, callback){
  if(isUndefined(value) || !isFunction(callback)){
    return;
  }
  let index = 0;
  if(value.forEach){
    while(index < value.length && !callback(value[index], index)){
      index ++;
    }
  } else {
    const keys = Object.keys(value);
    while(index < keys.length && !callback(value[keys[index]], keys[index])){
      index ++;
    }
  }
}

export function filter(value, callback){
  if(!isFunction(callback)){
    return;
  }
  if(isArray(value)){
    return value.filter(callback);
  }
  const object = {};
  each(value, (item, key) => {
    if(callback(item, key)){
      object[key] = item;
    }
  });
  return object;
}

// export function get(value, key, defaultValue){
//   if(isUndefined(value) || !isString(key)){
//     return defaultValue;
//   }
//   const parameter = [];
//   each(key.split('.'), item =>{
//     let temp = /(.*)\[(.*)\]/.exec(item);
//     if(temp){
//       parameter.push(temp[1]);
//       parameter.push(temp[2]);
//     }else{
//       parameter.push(item);
//     }
//   });
//   each(parameter, item=>{
//     value = value[item];
//   });
//   return value;
// }

