import btoa from '@/utils/btoa';

const timer = {};
export default function (callback: () => void, time = 500) {
  const name = btoa(`_${callback.toString()}`);
  timer[name] && clearTimeout(timer[name]);
  timer[name] = setTimeout(function () {
    callback();
    delete timer[name];
  }, time);
}
