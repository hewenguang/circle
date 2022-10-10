import each from '@/utils/each';

export default function (target: Array<string>, source: Array<string>) {
  let miss = false;
  each(target, (item) => {
    if (!source.includes(item)) {
      miss = true;
      return miss;
    }
    return;
  });
  return !miss;
}
