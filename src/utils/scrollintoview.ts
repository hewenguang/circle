import { isString, isElement, isObject } from '@/utils/is';

interface scrollIntoViewOptions {
  behavior?: 'auto' | 'smooth';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
}

const defaultBehavior = window.pageYOffset > 2000 ? 'auto' : 'smooth';

export default function (
  node: Element,
  opts?: ('auto' | 'smooth') | scrollIntoViewOptions
) {
  if (!isElement(node)) {
    return;
  }
  // @ts-ignore
  const options: scrollIntoViewOptions = isObject(opts)
    ? opts
    : {
        behavior: isString(opts) ? opts : defaultBehavior,
      };
  node.scrollIntoView({
    block: options.block || 'start',
    inline: options.inline || 'nearest',
    behavior: options.behavior || defaultBehavior,
  });
}
