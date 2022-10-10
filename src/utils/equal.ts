import each from '@/utils/each';
import { isPlainObject } from './is';

export default function (current: any, next: any) {
  if (!isPlainObject(current)) {
    return current === next;
  }
  const nextKeys = Object.keys(next);
  const currentKeys = Object.keys(current);
  if (currentKeys.length != nextKeys.length) {
    return false;
  }
  let equal = true;
  each(current, (item, key) => {
    if (isPlainObject(item)) {
      if (JSON.stringify(item) !== JSON.stringify(next[key])) {
        equal = false;
        return true;
      }
    } else {
      if (item !== next[key]) {
        equal = false;
        return true;
      }
    }
    return;
  });
  return equal;
}
