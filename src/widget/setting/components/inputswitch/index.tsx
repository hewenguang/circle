import React from 'react';
import { Input } from 'antd';
import keyboard from '@/utils/keyboard';
import LazySwitch from '../lazyswitch';
import './index.less';

export default function (props: any) {
  const { value = {}, onChange, disabled } = props;
  let keys: string[] = [];
  let counter: number = 0;
  let timer: any = null;
  const handleKeyDown = (event: any) => {
    if (event.key === 'Tab') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const key = keyboard(event);
    key && keys.push(key);
    counter++;
    if (counter === 1) {
      timer = setTimeout(function () {
        counter = 0;
        if (keys.length <= 0) {
          return;
        }
        onChange &&
          onChange(Object.assign({}, value, { value: keys.join(' ') }));
        keys = [];
      }, 500);
    } else if (counter === 2) {
      timer && clearTimeout(timer);
      counter = 0;
      if (keys.length <= 0) {
        return;
      }
      onChange && onChange(Object.assign({}, value, { value: keys.join(' ') }));
      keys = [];
    }
  };
  const handleChange = (checked: boolean) => {
    onChange && onChange(Object.assign({}, value, { checked }));
  };

  return (
    <div className="input-switch">
      {value && value.checked && (
        <Input
          disabled={disabled}
          value={value.value}
          onKeyDown={handleKeyDown}
        />
      )}
      <LazySwitch
        disabled={disabled}
        value={value.checked}
        onChange={handleChange}
      />
    </div>
  );
}
