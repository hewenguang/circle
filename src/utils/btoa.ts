export default function (value: string) {
  return window.btoa(unescape(encodeURIComponent(value)));
}
