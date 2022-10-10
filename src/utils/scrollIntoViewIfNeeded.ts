import { isElement } from '@/utils/is';

export default function (node: any, center?: boolean) {
  if (!isElement(node) || !node.scrollIntoViewIfNeeded) {
    return;
  }
  node.scrollIntoViewIfNeeded(center);
}
