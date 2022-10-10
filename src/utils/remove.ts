export default function (node: any) {
  node && node.parentElement && node.parentElement.removeChild(node);
}
