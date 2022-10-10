export default function (node: HTMLElement | void) {
  if (!node || !node.getBoundingClientRect) {
    return;
  }
  // @ts-ignore
  if (node._rect) {
    // @ts-ignore
    return node._rect;
  }
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const rect = node.getBoundingClientRect();
  if (scrollX <= 0 && scrollY <= 0) {
    // @ts-ignore
    node._rect = rect;
    // @ts-ignore
    return node._rect;
  }
  // @ts-ignore
  node._rect = {
    top: rect.top + scrollY,
    right: rect.right - scrollX,
    bottom: rect.bottom - scrollY,
    left: rect.left + scrollX,
    width: rect.width,
    height: rect.height,
  };
  // @ts-ignore
  return node._rect;
}
