import { isString, isElement, isTextNode } from './is';

export default function (node: any) {
  if (!node) {
    return '';
  }
  let text: any = '';
  if (isString(node)) {
    text = node;
  } else if (isTextNode(node)) {
    text = node.nodeValue;
  } else if (isElement(node)) {
    text = node.textContent;
  }
  const value = (text || '').trim();
  return value.length > 0 ? value.replace(/^&nbsp;+|&nbsp;+$/g, '') : '';
}
