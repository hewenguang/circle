import create from '@/utils/create';

export default function ({
  style,
  onReady,
  mode = 'closed',
  delegatesFocus = false,
}: any = {}) {
  const host = create('div');
  const root = document.documentElement;
  root.insertBefore(host, document.body);
  const shadowRoot = host.attachShadow({ mode, delegatesFocus });
  if (style) {
    let index = 0;
    const stylesheet = Array.isArray(style) ? style : [style];
    const size = stylesheet.length;
    stylesheet.forEach((url: string) => {
      if (!url) {
        return;
      }
      const item = url.endsWith('.css')
        ? create('link', {
            rel: 'stylesheet',
            href: url,
          })
        : create('style', { textContent: url });
      item.addEventListener('load', () => {
        index++;
        index >= size && onReady && onReady(shadowRoot, host);
      });
      shadowRoot.appendChild(item);
    });
  } else {
    onReady && onReady(shadowRoot, host);
  }
  return shadowRoot;
}
