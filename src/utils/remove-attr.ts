import each from '@/utils/each';
import { isString, isFunction } from '@/utils/is';

export default function (node: HTMLElement, value?: any) {
  if (!node) {
    return;
  }
  if (isString(value)) {
    // @ts-ignore
    node.removeAttribute(value);
    return;
  }
  const attrToRemove: string[] = [];
  each(node.attributes, (attribute) => {
    const name = attribute.nodeName;
    // @ts-ignore
    isFunction(value) && value(name) && attrToRemove.push(name);
  });
  each(attrToRemove, (attr) => {
    node.removeAttribute(attr);
  });
}
