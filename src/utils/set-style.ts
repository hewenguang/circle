import { isNumber, isString, isUndefined } from './is';

export default function (
  node: HTMLElement,
  name: string,
  value: number | string
) {
  if (!node || !isString(name) || isUndefined(value)) {
    return;
  }
  node.style[name] =
    isNumber(value) && !['zIndex', 'opacity'].includes(name)
      ? `${value}px`
      : value;
}
