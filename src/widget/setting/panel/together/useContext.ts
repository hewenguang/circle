import App from '@/core/app.class';
import { useState, useEffect } from 'react';

interface IProps {
  app: App;
  table: string;
  defaultValue: any;
}

export default function (props: IProps) {
  const { app, table = 'setting', defaultValue } = props;
  const [option, setOption] = useState(defaultValue);
  const query = () => {
    app
      .option({
        table,
      })
      .then((data: any) => {
        const results = data || [];
        const values = {};
        results.forEach((item: any) => {
          const key = item.id;
          delete item.id;
          key && (values[key] = item);
        });
        setOption(values);
      });
  };
  const change = (value: any, name: string) => {
    app
      .option({
        table,
        name,
        value,
      })
      .then(() => {
        setOption(Object.assign({}, option, { [name]: value }));
      });
  };

  useEffect(query, []);

  return [option, change];
}
