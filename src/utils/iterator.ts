export default function (node: Element) {
  let current: any = node;
  let mirror: any = node.cloneNode(true);
  while (current) {
    // @ts-ignore
    mirror._mirrorElement = current;
    const firstElementChild = current.firstElementChild;
    if (firstElementChild) {
      current = firstElementChild;
      mirror = mirror.firstElementChild;
    } else {
      let nextSibling;
      while (current !== node && !(nextSibling = current.nextElementSibling)) {
        current = current.parentElement;
        mirror = mirror.parentElement;
      }
      if (current === node) {
        break;
      }
      current = nextSibling;
      mirror = mirror.nextElementSibling;
    }
  }
  return mirror;
}
