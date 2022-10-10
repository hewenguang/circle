import React from 'react';
import Font from './font';
import Card from './card';
import Vote from './vote';
import Reset from './reset';
import Local from './local';
import Color from './color';
import Align from './align';
import Select from './select';
import useApp from '@/hooks/useApp';
import List from '@/component/list';
import Slider from '@/component/slider';
import LazySwitch from './lazyswitch';
import IconSwitch from './iconswitch';
import InputSwitch from './inputswitch';
import Version from '@/component/version';
import { isString, isPlainObject } from '@/utils/is';

export interface IProps {
  id: string;
  data: Array<any>;
  value: object;
  activeKeys?: Array<string>;
  darkmode?: 'dark' | 'light' | '';
  onChange?: (val: any, id?: string) => void;
}

export default function (props: IProps) {
  const { id, data, value, activeKeys, darkmode, onChange } = props;
  const app = useApp();
  let items = data;
  // toolbar 删除图标
  if (id === 'toolbar') {
    items = items.map((item) => {
      const icon = item.icon;
      icon && delete item.icon;
      return item;
    });
  }

  return (
    <List
      field={id}
      data={items}
      activeKeys={activeKeys}
      renderItem={(item: any) => {
        const { type, id, depplugin } = item;
        const handleChange = (val: any, key?: any) => {
          onChange && onChange(val, isString(key) ? key : id);
        };

        if (!id) {
          return null;
        }

        switch (type) {
          case 'font':
            return (
              <Font
                width={160}
                {...item}
                key={id}
                value={value[id]}
                onChange={handleChange}
              />
            );
          case 'select':
            return (
              <Select
                width={160}
                {...item}
                key={id}
                value={value[id]}
                onChange={handleChange}
              />
            );
          case 'color':
            return (
              <Color
                {...item}
                key={id}
                value={value}
                darkmode={darkmode}
                onChange={handleChange}
              />
            );
          case 'switch':
            return (
              <LazySwitch
                key={id}
                {...item}
                depPlugin={depplugin}
                value={
                  isPlainObject(value[id]) ? value[id].checked : !!value[id]
                }
                onChange={handleChange}
              />
            );
          case 'align':
            return (
              <Align
                width={160}
                {...item}
                key={id}
                value={value[id]}
                onChange={handleChange}
              />
            );
          case 'input-switch':
            return (
              <InputSwitch
                {...item}
                key={id}
                value={value[id]}
                onChange={handleChange}
              />
            );
          case 'icon-switch':
            return (
              <IconSwitch
                {...item}
                key={id}
                value={value[id]}
                onChange={handleChange}
              />
            );
          case 'version':
            return <Version key={id} />;
          case 'local':
            return <Local {...item} key={id} />;
          case 'reset':
            return <Reset {...item} key={id} />;
          case 'card':
            return <Card {...item} key={id} app={app} />;
          case 'vote':
            return <Vote {...item} key={id} />;
          default:
            return (
              <Slider
                {...item}
                key={id}
                value={value[id]}
                onChange={handleChange}
              />
            );
        }
      }}
    />
  );
}
