const e = 'a';
const d = 100;
const a = 100;
const i = 100;
const element = document.createElement('canvas');
const canvas = element.getContext('2d');
element.width = a;
element.height = i;
canvas && (canvas.textAlign = 'center');
canvas && (canvas.fillStyle = 'black');
canvas && (canvas.textBaseline = 'middle');

export default function (value: string) {
  const h = 'Arial';
  if (value.toLowerCase() === h.toLowerCase()) {
    return true;
  }
  function check(j: string) {
    canvas && canvas.clearRect(0, 0, a, i);
    canvas && (canvas.font = d + 'px ' + j + ', ' + h);
    canvas && canvas.fillText(e, a / 2, i / 2);
    const k = canvas ? canvas.getImageData(0, 0, a, i).data : '';
    return [].slice.call(k).filter((l) => l != 0);
  }
  return check(h).join('') !== check(value).join('');
}
