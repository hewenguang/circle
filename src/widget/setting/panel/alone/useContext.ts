import App from '@/core/app.class';
import { useState, useEffect } from 'react';
import { isUndefined, isPlainObject } from '@/utils/is';

interface IProps {
  app: App;
  id: string;
  table?: string;
  defaultValue: any;
}

export default function (props: IProps) {
  const { app, id, table = 'setting', defaultValue } = props;
  const [option, setOption] = useState(defaultValue);
  const query = function (callback?: (data: any) => void) {
    app
      .option({
        table,
        name: id,
      })
      .then((data: any) => {
        if (callback) {
          callback(data);
        } else {
          !isUndefined(data) && setOption(data);
        }
      });
  };
  const change = (value: any, key: string) => {
    if (value === option) {
      app
        .option({
          table,
          name: id,
          value: 'remove',
        })
        .then(() => {
          setOption(value);
        });
    } else {
      query(function (theme = {}) {
        const newTheme = Object.assign(
          theme,
          isPlainObject(value) ? value : { [key]: value }
        );
        app
          .option({
            table,
            name: id,
            value: newTheme,
          })
          .then(() => {
            setOption(newTheme);
          });
      });
    }
  };

  useEffect(query, [id]);

  return [option, change];
}
