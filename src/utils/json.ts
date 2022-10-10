import { isString } from '@/utils/is';

export function parse(value: string | null | object): any {
  if (!isString(value)) {
    return value;
  }
  try {
    // @ts-ignore
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function stringify(value: string | number | object): any {
  if (isString(value)) {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch (e) {
    return value;
  }
}
