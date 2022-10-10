import each from '@/utils/each';
import isTag from '@/utils/istag';
import { isElement } from '@/utils/is';
import classname from '@/utils/classname';

const className = classname('noise');
const parentClassName = classname('element');

export function highlight({
  time,
  title,
  cover,
  article,
}: {
  time?: HTMLElement;
  title?: HTMLElement;
  cover?: HTMLElement;
  article: HTMLElement;
}) {
  // article
  let currentParent = article;
  let current = article.parentElement;
  while (current && !isTag(current, 'body')) {
    each(current.children, (item: HTMLElement) => {
      item.classList.add(item === currentParent ? parentClassName : className);
    });
    currentParent = current;
    current = current.parentElement;
  }
  // meta
  each([time, title, cover], (meta: HTMLElement) => {
    if (!isElement(meta) || article.contains(meta)) {
      return;
    }
    currentParent = meta;
    current = meta.parentElement;
    while (current && !isTag(current, 'body')) {
      // 和内容块同级节点
      if (current.classList.contains(parentClassName)) {
        currentParent.classList.remove(className);
        currentParent.classList.add(parentClassName);
        break;
      }
      each(current.children, (item: HTMLElement) => {
        if (item === currentParent) {
          item.classList.remove(className);
          item.classList.add(parentClassName);
        } else {
          item.classList.add(className);
        }
      });
      currentParent = current;
      current = current.parentElement;
    }
  });
}

export function unhighlight(context: HTMLElement = document.body) {
  const focus = context.querySelectorAll(`.${className}`);
  focus.length > 0 &&
    each(focus, (item: HTMLElement) => {
      item.classList.remove(className);
    });
  const items = context.querySelectorAll(`.${parentClassName}`);
  items.length > 0 &&
    each(items, (item: HTMLElement) => {
      item.classList.remove(className);
    });
}
