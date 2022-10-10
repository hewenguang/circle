import each from '@/utils/each';
import { isString } from '@/utils/is';

export default function (node: HTMLImageElement) {
  let url: string | undefined = '';
  each(node.attributes, (attribute) => {
    const nodeName = attribute.nodeName;
    if (['class', 'role', 'src', 'alt'].includes(nodeName)) {
      return;
    }
    if (/thumbnail/i.test(nodeName)) {
      return;
    }
    const nodeValue = `${attribute.nodeValue}`;
    // original https://www.ithome.com/0/544/257.htm
    if (
      (nodeValue.startsWith('http') || /src|url|origin/i.test(nodeName)) &&
      nodeValue.split('/').length > 1 &&
      nodeValue.length > 10
    ) {
      url = nodeValue.split(/\s/).shift();
      return true;
    }
    return;
  });
  const href = url ? url : node.src;
  if (href && !href.endsWith('svg')) {
    return href;
  }
  // https://segmentfault.com/a/1190000040140070?utm_source=sf-similar-article
  const bg = `${window.getComputedStyle(node).backgroundImage}`.replace(
    /url\("(.*?)"\)/,
    '$1'
  );
  return isString(bg) && bg !== 'none' && bg.split('/').length > 1 ? bg : '';
}
