import { isString } from '@/utils/is';

export default function (value: string) {
  if (isString(value) && value.length === 7 && value.startsWith('#')) {
    // @ts-ignore
    const color = value
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => '#' + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));
    return {
      r: color[0],
      g: color[1],
      b: color[2],
    };
  }
  return {
    r: 255,
    g: 255,
    b: 255,
  };
}
