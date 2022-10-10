import unix from '@/utils/unix';
import getData from '@cache/data';
import { isObject } from '@/utils/is';
import each from '@/utils/each';

export default function (callback: (error: string, data?: any) => void) {
  const app = this;
  const items = getData(app);
  const data = {};
  each(items, (values, table) => {
    !Array.isArray(data[table]) && (data[table] = []);
    each(values, (value, key) => {
      let item: any = {
        id: key,
        changed: unix(),
      };
      if (isObject(value)) {
        item = {
          ...item,
          ...value,
        };
      } else {
        item.value = value;
      }
      data[table].push(item);
    });
  });
  app.fire('import', callback, { data });
}
