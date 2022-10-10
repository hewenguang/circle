import React from 'react';
import getData from '@cache/data';
import useApp from '@/hooks/useApp';
import { isPlainObject, isBoolean, isUndefined } from '@/utils/is';
import Reset from '../reset';
import useTable from './useContext';
import Component from '../../components';

export interface IProps {
  id: string;
  table: string;
  reset?: boolean;
  data: Array<any>;
  activeKeys: Array<string>;
}

export default function (props: IProps) {
  const { id, data, activeKeys, table, reset } = props;
  const app = useApp();
  const dataValue = getData(app);
  const defaultValue = dataValue[table];
  const [value, onChange] = useTable({
    app,
    table,
    defaultValue: defaultValue || {},
  });

  const handleChange = (checked: any, key?: string) => {
    if (!key) {
      return;
    }
    const item = !isUndefined(value[key]) ? value[key] : defaultValue[key];
    if (isPlainObject(item)) {
      const newItem = isBoolean(checked)
        ? {
            ...item,
            checked,
          }
        : {
            ...item,
            ...checked,
          };
      onChange && onChange(newItem, key);
      setTimeout(() => {
        app.fire(`${table}_hot`, newItem, key);
      }, 100);
    } else {
      onChange && onChange(checked, key);
      setTimeout(() => {
        app.fire(`${table}_hot`, checked, key);
      }, 100);
    }
  };

  return (
    <>
      <Component
        id={id}
        data={data}
        value={value}
        activeKeys={activeKeys}
        onChange={handleChange}
      />
      {reset && <Reset app={app} ids={[table]} />}
    </>
  );
}
