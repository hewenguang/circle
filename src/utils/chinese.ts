export default function (value: any) {
  return /[\u4e00-\u9fa5]/.test(value);
}
