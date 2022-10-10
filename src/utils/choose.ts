import each from '@/utils/each';
import remove from '@/utils/remove';
import { isElement } from '@/utils/is';
import classname from '@/utils/classname';
import create from '@/utils/create';

export default function (
  root: HTMLElement,
  cbClick: (node: EventTarget | null) => void,
  cbMouseover?: (node: EventTarget | null) => boolean
) {
  if (!root) {
    return;
  }
  const className = classname('choose');
  const stylesheet = create('style', {
    textContent: `
      .${className}{
        background:#ddd !important;
        cursor:pointer !important;
        outline:3px dashed #777 !important;
      }';
    `,
  });
  function handleMouseover(event: MouseEvent) {
    const target: any = event.target;
    // @ts-ignore
    const fromTarget = event.fromElement || event.relatedTarget;
    isElement(fromTarget) && fromTarget.classList.remove(className);
    if (cbMouseover) {
      !cbMouseover(target) && target.classList.add(className);
    } else {
      target.classList.add(className);
    }
  }
  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (!cbClick) {
      return;
    }
    const target = event.target;
    if (cbMouseover) {
      !cbMouseover(target) && cbClick(target);
    } else {
      cbClick(target);
    }
  }

  root.appendChild(stylesheet);
  root.addEventListener('click', handleClick);
  root.addEventListener('mouseover', handleMouseover);

  return function () {
    remove(stylesheet);
    root.removeEventListener('click', handleClick);
    root.removeEventListener('mouseover', handleMouseover);
    each(root.querySelectorAll(`.${className}`), function (node) {
      node.classList.remove(className);
    });
  };
}
