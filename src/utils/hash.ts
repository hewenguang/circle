export function getHash(
  key: string | Array<string>,
  value?: string,
  hashs: Array<string> = location.hash.substring(1).split('&')
) {
  let matchs: Array<string> = [];
  // # 会成 ['']
  if (hashs.join('').length <= 0) {
    return {
      hashs: [],
      hash: matchs,
    };
  }
  const newKey = Array.isArray(key) ? key : [key];
  const hashArr = hashs.filter((item: string) => {
    const index = newKey.findIndex((itemKey) => item.indexOf(itemKey) >= 0);
    if (index < 0) {
      return true;
    } else {
      matchs.push(item);
    }
    return;
  });
  if (value) {
    const newHash = `${key}=${value}`;
    hashArr.push(newHash);
    matchs = [];
    matchs.push(newHash);
  }
  return {
    hashs: hashArr,
    hash: matchs,
  };
}

export function updateHash(hashs: Array<string> = []) {
  window.history.replaceState(
    null,
    '',
    `${location.pathname + location.search}${
      hashs.length > 0 ? '#' + hashs.join('&') : ''
    }`
  );
}
