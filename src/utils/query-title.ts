import { isElement } from './is';
import nodeText from '@/utils/node-text';

export default function (root: Element, defaultValue: string = document.title) {
  const value = `${defaultValue || 'circle'}`;
  if (!root) {
    return value;
  }
  const title = root.querySelector('.page .title');
  if (isElement(title)) {
    return nodeText(title);
  }
  return value;
}
