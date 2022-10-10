export function isType(value: any, type: string) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function isString(value: any) {
  return isType(value, 'String');
}

export function isChinese(value: any) {
  return /[\u4e00-\u9fa5]/.test(value);
}

export function isTextNode(value: any) {
  return isType(value, 'Text');
}

export function isElement(value: any) {
  return value && value.nodeType && value.nodeType === 1;
}

export function isNumber(value: any) {
  return isType(value, 'Number');
}

export function isFunction(value: any) {
  return isType(value, 'Function');
}

export function isUndefined(value: any) {
  return isType(value, 'Undefined');
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

export function isNodeWhitespace(node: any) {
  if (!isTextNode(node)) {
    return false;
  }
  const nodeValue = node.nodeValue.trim();
  if (nodeValue.length <= 0) {
    return true;
  }
  return /^[\s\xA0]+$/.test(nodeValue);
}

export function isPlainObject(value: any) {
  if (!isObject(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  // @ts-ignore
  const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (
    isFunction(Ctor) &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) ===
      Function.prototype.toString.call(Object)
  );
}
