import log from '@/log';

export default function (url: string) {
  let location;
  try {
    location = new URL(/.*?:\/\//.test(url) ? url : `http://${url}`);
  } catch (e) {
    log(e);
    location = {
      hash: '',
      href: url,
      host: '--',
      hostname: '--',
    };
  }
  return location;
}
