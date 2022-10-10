import { isElement } from './is';
import getStyle from './get-style';

export default function (node: HTMLElement | null) {
  if (!node) {
    return false;
  }
  if (!isElement(node)) {
    return false;
  }
  if (['br', 'hr', 'img', 'body'].includes(node.tagName.toLowerCase())) {
    return true;
  }
  const rect = node.getBoundingClientRect();
  if (rect.height <= 0 || rect.width <= 0) {
    return false;
  }
  return (
    '0' !== getStyle(node, 'opacity') &&
    'hidden' !== getStyle(node, 'visibility')
  );
}
