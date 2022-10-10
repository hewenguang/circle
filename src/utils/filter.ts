import each from '@/utils/each';
import { isFunction } from '@/utils/is';

export default function (value: any, callback: any) {
  if (!isFunction(callback)) {
    return;
  }
  if (Array.isArray(value)) {
    return value.filter(callback);
  }
  const object = {};
  each(value, (item, key) => {
    if (callback(item, key)) {
      object[key] = item;
    }
  });
  return object;
}
