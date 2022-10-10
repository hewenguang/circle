export default function (value: number[]) {
  return (
    '#' +
    [value[0], value[1], value[2]]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}
