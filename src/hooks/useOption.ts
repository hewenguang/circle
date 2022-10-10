import log from '@/log';
import useApp from './useApp';
import { useState, useEffect } from 'react';
import { isUndefined, isFunction } from '@/utils/is';

interface IProps {
  id: string;
  table?: string;
  defaultValue: any;
  disabled?: boolean;
}

export default function (props: IProps) {
  const { id, table = 'setting', defaultValue, disabled } = props;
  const app = useApp();
  const [option, setOption] = useState(defaultValue);
  const fetch = () => {
    if (disabled) {
      return;
    }
    app
      .option({
        table,
        name: id,
      })
      .then((data: any) => {
        !isUndefined(data) && data !== null && setOption(data);
      });
  };
  const change = (value: any, callback: any) => {
    if (disabled) {
      return;
    }
    if (isUndefined(value)) {
      return;
    }
    app
      .option({
        value,
        table,
        name: id,
      })
      .then(() => {
        setOption(value);
        isFunction(callback) && callback();
      })
      .catch((error: string) => {
        log(error);
        isFunction(callback) && callback();
      });
  };

  useEffect(fetch, [id]);

  return [option, change, fetch];
}
