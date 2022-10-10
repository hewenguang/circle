import App from '@/core/app.class';
import each from '@/utils/each';
import setAttr from '@/utils/set-attr';
import nodeText from '@/utils/node-text';
import { useRef, useState, useEffect } from 'react';
import { isString } from '@/utils/is';
import { Item } from './main';

export default function (app: App) {
  const index = useRef(0);
  const [data, setData] = useState<Array<Item>>([]);

  useEffect(() => {
    return app.on('outline_render', (article: HTMLElement) => {
      const items: Array<Item> = [];
      each(article.querySelectorAll('h1,h2,h3,h4,h5,h6'), (item) => {
        const title = nodeText(item);
        if (!isString(title) || title.length <= 0) {
          return;
        }
        const id = `outline_${index.current}`;
        setAttr(item, 'id', id);
        index.current++;
        items.push({
          id,
          title,
          level: parseInt(item.nodeName.charAt(1)),
        });
      });
      items.length > 0 && setData([...data, ...items]);
    });
  }, [data]);

  useEffect(() => {
    return app.on('outline_empty', () => {
      index.current = 0;
      setData([]);
    });
  }, []);

  useEffect(() => {
    return app.on('render_page_ready', (article: HTMLElement) => {
      app.fire('outline_render', article);
    });
  }, []);

  return data;
}
