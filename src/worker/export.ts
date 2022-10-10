import each from '@/utils/each';

export default function (
  callback: (error?: string | null, data?: any) => void,
  { tables }: { tables: Array<string> }
) {
  const app = this;
  if (tables.length <= 0) {
    callback && callback(app.i10n('exception'));
    return;
  }
  Promise.all(
    tables.map((table) =>
      app.option({ table }).then((data: any) => ({
        data,
        table,
      }))
    )
  )
    .then((values) => {
      const setting = {};
      each(values, ({ table, data }) => {
        each(data, (item) => {
          !Array.isArray(setting[table]) && (setting[table] = []);
          setting[table].push(item);
        });
      });
      callback && callback(null, setting);
    })
    .catch(function (error) {
      callback && callback(error.message);
    });
}
