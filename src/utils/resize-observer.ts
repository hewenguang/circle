import noop from '@/utils/noop';
import { isElement } from '@/utils/is';

export default function (target: HTMLElement | Element, callback: () => void) {
  if (!isElement(target)) {
    return noop;
  }
  const detch = new ResizeObserver(callback);
  detch.observe(target);
  return () => {
    detch.disconnect();
  };
}
