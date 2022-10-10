import { isString, isChinese } from './is';

export default function (value: string) {
  if (!isString(value) || value.trim().length <= 0) {
    return 0;
  }
  return isChinese(value) ? value.length : value.split(' ').length;
}
