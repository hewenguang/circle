import { getHash } from './hash';

export default function (url = location.href) {
  if (/circle=/.test(url)) {
    const [base, hash = ''] = url.split('#');
    if (!hash) {
      return url;
    }
    const { hashs } = getHash(['circle', 'widget'], undefined, hash.split('&'));
    return `${base}${hashs.length > 0 ? '#' + hashs.join('&') : ''}`;
  }
  return url;
}
