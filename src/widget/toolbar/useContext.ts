import each from '@/utils/each';
import sort from '@/utils/sort';
import App from '@/core/app.class';
import groupBy from '@/utils/group';
import { useState, useEffect } from 'react';
import { Toolbar } from './toolbar';

export default function (app: App) {
  const [toolbars, setToolbars] = useState<Array<Toolbar>>([]);

  useEffect(() => {
    app
      .option({
        table: 'toolbar',
      })
      .then((data: Array<Toolbar>) => {
        const items: Array<Toolbar> = [];
        each(data, (item: Toolbar) => {
          item.checked && items.push(item);
        });
        setToolbars(items);
      });
  }, []);

  useEffect(() => {
    return app.on('toolbar_hot', (toolbar: Toolbar, id: string) => {
      if (toolbar.checked) {
        const items: Array<Toolbar> = [...toolbars];
        const index = items.findIndex((item: Toolbar) => item.id === id);
        if (index >= 0) {
          items[index] = {
            ...toolbar,
            id,
          };
        } else {
          items.push({
            ...toolbar,
            id,
          });
        }
        setToolbars(items);
      } else {
        setToolbars(toolbars.filter((item) => item.id !== id));
      }
    });
  }, [toolbars]);

  useEffect(() => {
    if (toolbars.length <= 0) {
      return;
    }
    return app.on(
      'toolbar_state',
      function (
        id: string | Array<string>,
        state:
          | 'active'
          | 'inactive'
          | 'loading'
          | 'loaded'
          | 'visible'
          | 'hidden',
        reverse?: boolean
      ) {
        if (!id) {
          return;
        }
        let items = [...toolbars];
        (Array.isArray(id) ? id : [[id, state]]).forEach((ids: any) => {
          const [id, state] = ids;
          items = items.map((item: Toolbar) => {
            const condition = reverse ? item.id !== id : item.id === id;
            if (condition) {
              if (['active', 'inactive'].includes(state)) {
                return {
                  ...item,
                  active: state === 'active',
                };
              } else if (['loading', 'loaded'].includes(state)) {
                return {
                  ...item,
                  loading: state === 'loading',
                };
              } else if (['visible', 'hidden'].includes(state)) {
                return {
                  ...item,
                  hidden: state === 'hidden',
                };
              }
            }
            return item;
          });
        });
        setToolbars(items);
      }
    );
  }, [toolbars]);

  return groupBy(sort(toolbars), (item: Toolbar) => item.group);
}
