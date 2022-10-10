export default function (node: HTMLElement, property: string) {
  if (node[property]) {
    return node[property];
  }
  if (node.style && node.style[property]) {
    return node.style[property];
  }
  if (window.getComputedStyle) {
    return window.getComputedStyle(node, null)[property];
  }
}
