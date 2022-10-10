import create from '@/utils/create';
import { isString, isElement } from '@/utils/is';

export default function (uid: string, style?: string) {
  // @ts-ignore
  if (!isString(style) || style.length <= 0) {
    return;
  }
  const app = this;
  const root = app.data('root');
  if (!isElement(root)) {
    return;
  }
  const className = `_${uid}`;
  if (root.classList.contains(className)) {
    return;
  }
  root.appendChild(
    create('style', {
      textContent: style,
    })
  );
  root.classList.add(className);
}
