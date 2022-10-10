import each from '@/utils/each';
import { parse } from '@/utils/json';

type Option = {
  data: string | object;
};

export default function (
  callback: (error?: string, data?: any) => void,
  { data }: Option
) {
  const app = this;
  if (!data) {
    callback && callback(app.i10n('exception'));
    return;
  }
  let items = parse(data);
  const actions: Promise<any>[] = [];
  each(items, (value, table) => {
    actions.push(
      app
        .option({ table, value: 'clear' })
        .then(() => app.option({ value, table, action: 'setMultiple' }))
    );
  });
  if (actions.length > 0) {
    Promise.all(actions)
      .then(() => {
        // 更新右键菜单
        app.fire('menu', callback, {
          action: 'start',
        });
      })
      .catch((error) => {
        callback && callback(error.message);
      });
  } else {
    callback && callback();
  }
}
