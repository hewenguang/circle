export default function () {
  // 文档方向
  let dir = 'ltr';
  if (document.dir) {
    dir = document.dir;
  } else {
    const rootDir = document.documentElement.getAttribute('dir');
    if (rootDir) {
      dir = rootDir;
    } else {
      const bodyDir = getComputedStyle(document.body).direction;
      if (bodyDir) {
        dir = bodyDir;
      } else {
        dir = getComputedStyle(document.documentElement).direction;
      }
    }
  }
  return dir;
}
