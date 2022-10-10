import noop from '@/utils/noop';
import { isElement } from '@/utils/is';

export default function (
  target: HTMLElement | Element,
  callback: (addNodes: NodeList) => void,
  options: {
    attributeFilter?: string[];
    attributeOldValue?: boolean;
    attributes?: boolean;
    characterData?: boolean;
    characterDataOldValue?: boolean;
    childList?: boolean;
    subtree?: boolean;
  } = { childList: true, subtree: true }
) {
  if (!isElement(target)) {
    return noop;
  }
  const detch = new MutationObserver(function (mutations) {
    if (!mutations || mutations.length < 1) {
      return;
    }
    const addNodes = mutations[0].addedNodes;
    if (!addNodes || addNodes.length < 1) {
      return;
    }
    callback(addNodes);
  });
  detch.observe(target, options);
  return () => {
    detch.disconnect();
  };
}
