export default function () {
  const userAgent = navigator.userAgent;

  return (
    !!userAgent.match(/AppleWebKit.*Mobile.*/) ||
    !!userAgent.match(/\(i[^;]+;( U;)? CPuserAgent.+Mac OS X/) ||
    userAgent.indexOf('Android') > -1 ||
    userAgent.indexOf('Linux') > -1 ||
    userAgent.indexOf('iPhone') > -1 ||
    userAgent.indexOf('iPad') > -1
  );
}
