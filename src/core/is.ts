export function isType(value: any, type: string) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function isUndefined(value: any) {
  return isType(value, 'Undefined');
}

export function isString(value: any) {
  return isType(value, 'String');
}

export function isFunction(value: any) {
  return isType(value, 'Function');
}

export function isBoolean(value: any) {
  return isType(value, 'Boolean');
}

export function isAsyncFunction(value: any) {
  return isType(value, 'AsyncFunction');
}

export function isObject(value: any) {
  return isType(value, 'Object');
}
