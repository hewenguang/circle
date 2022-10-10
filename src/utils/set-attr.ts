import each from './each';
import { isNumber } from './is';
import setStyle from './set-style';

export default function (node: HTMLElement, attr: string, value: any) {
  const attrValue =
    isNumber(value) && !['zIndex', 'opacity'].includes(attr)
      ? `${value}px`
      : value;
  switch (attr) {
    case 'innerHTML':
    case 'innerText':
    case 'className':
    case 'textContent':
      node[attr] = attrValue;
      break;
    case 'style':
      each(value, (itemValue, itemKey) => {
        setStyle(node, itemKey, itemValue);
      });
      break;
    default:
      node.setAttribute(attr, attrValue);
  }
}
