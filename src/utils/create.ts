import each from './each';
import setAttr from './set-attr';

export default function create(
  name: string,
  attrs?: {
    [index: string]: any;
  }
): any {
  const node = document.createElement(name);
  attrs &&
    each(attrs, (value, key) => {
      setAttr(node, key, value);
    });
  return node;
}
