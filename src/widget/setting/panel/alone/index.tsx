import getData from '@cache/data';
import useApp from '@/hooks/useApp';
import React, { useState } from 'react';
import useOption from '@/hooks/useOption';
import { isPlainObject, isBoolean, isUndefined } from '@/utils/is';
import Reset from '../reset';
import Night from '../night';
import useAlone from './useContext';
import Component from '../../components';

export interface IProps {
  id: string;
  reset?: boolean;
  night?: boolean;
  theme?: boolean;
  data: Array<any>;
  activeKeys: Array<string>;
}

export default function (props: IProps) {
  const { id, data, reset, night, theme, activeKeys } = props;
  const app = useApp();
  const dataValue = getData(app);
  const [mode, setMode] = useState(false);
  const [nightValue, setNightValue] = useOption({
    disabled: !night,
    id: `${id}_night`,
    defaultValue: false,
  });
  const darkValue = mode ? 'dark' : 'light';
  const darkmode = nightValue ? darkValue : '';
  const [value, onChange] = useAlone({
    app,
    id: nightValue ? `${id}_${darkValue}` : id,
    defaultValue:
      dataValue.setting && dataValue.setting[id] ? dataValue.setting[id] : {},
  });
  const handleChange = (checked: any, key?: string) => {
    if (!key) {
      return;
    }
    let item = value[key];
    if (
      isUndefined(item) &&
      key &&
      dataValue.setting &&
      dataValue.setting[id] &&
      dataValue.setting[id][key]
    ) {
      item = dataValue.setting[id][key];
    }
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
      onChange &&
        onChange({
          ...value,
          [key]: newItem,
        });
      setTimeout(() => {
        if (item.group && ['text', 'code', 'gallery'].includes(item.group)) {
          // 实时处理按钮组
          app.fire('toolbox_hot');
        } else {
          app.fire(`${id}_${key}`, newItem, key);
        }
      }, 100);
    } else {
      onChange && onChange(checked, key);
      theme && app.fire('theme', checked, key);
      setTimeout(() => {
        app.fire(`${id}_${key}`, checked);
      }, 100);
    }
  };

  return (
    <>
      {night && (
        <Night
          id={id}
          value={mode}
          onChange={setMode}
          nightValue={nightValue}
          nightChange={setNightValue}
        />
      )}
      <Component
        id={id}
        data={data}
        value={value}
        darkmode={darkmode}
        onChange={handleChange}
        activeKeys={activeKeys}
      />
      {reset && (
        <Reset
          app={app}
          ids={[id, `${id}_light`, `${id}_dark`, `${id}_night`]}
        />
      )}
    </>
  );
}
