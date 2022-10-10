export default function (node: Element | null, name: string) {
  return node && node.tagName && node.tagName.toLowerCase() === name;
}
