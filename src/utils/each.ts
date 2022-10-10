export default function each(
  value: any,
  callback: (value: any, key: any) => void | boolean
) {
  if (!value) {
    return;
  }
  let index = 0;
  if (value.forEach) {
    const length = value.length;
    if (length <= 0) {
      return;
    }
    while (index < length && !callback(value[index], index)) {
      index++;
    }
  } else {
    const keys = Object.keys(value);
    const length = keys.length;
    if (length <= 0) {
      return;
    }
    while (index < length && !callback(value[keys[index]], keys[index])) {
      index++;
    }
  }
}
