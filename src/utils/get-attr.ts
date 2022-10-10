import { isString } from './is';

export default function (node: HTMLElement, value?: string) {
  if (!node) {
    return;
  }
  if (value && isString(value)) {
    return node.getAttribute(value);
  }
  return Array.prototype.slice
    .call(node.attributes)
    .reduce((prev, next) => `${prev} ${next.nodeValue}`, '');
}
