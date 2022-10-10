export default function (callback: () => void) {
  if (document.readyState === 'complete') {
    callback();
    return;
  }
  let timer: any;
  function done(event?: any) {
    if (
      event &&
      event.type &&
      event.type == 'readystatechange' &&
      document.readyState != 'complete'
    ) {
      return;
    }
    timer && clearTimeout(timer);
    document.removeEventListener('DOMContentLoaded', done, false);
    document.removeEventListener('readystatechange', done, false);
    callback();
  }
  function wait() {
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      if (!document.body) {
        wait();
      } else {
        done();
      }
    }, 4000);
  }
  document.addEventListener('DOMContentLoaded', done, false);
  document.addEventListener('readystatechange', done, false);
  wait();
}
