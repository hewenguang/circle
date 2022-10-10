import { Input } from 'antd';
import each from '@/utils/each';
import useApp from '@/hooks/useApp';
import React, { useRef, useState, useEffect } from 'react';
import cn from './cn';
import en from './en';
import Select from '../select';
import support from './support';

export default function (props: any) {
  const {
    id,
    value,
    onChange,
    placeholder,
    defaultValue,
    width = '100%',
  } = props;
  const app = useApp();
  const data = [
    {
      title: app.i10n('default'),
      value: 'reset',
    },
    {
      title: app.i10n('custom'),
      value: 'custom',
    },
    ...(id === 'cnfont' ? cn : en),
  ];
  const inputRef = useRef(null);
  const filtered = useRef(false);
  const [items, setItems] = useState(data);
  const [custom, setCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const handleInputBlur = (event: any) => {
    setCustom(false);
    onChange && onChange(event.target.value);
  };
  const handleInputPress = (event: any) => {
    setCustom(false);
    onChange && onChange(event.target.value);
  };
  const handleInputChange = (event: any) => {
    setCustomValue(event.target.value);
  };
  const handleSelectChange = (val: string) => {
    if (val === 'custom') {
      setCustom(true);
    } else {
      onChange && onChange(val);
      customValue && setCustomValue('');
    }
  };
  const handleVisibleChange = (open: boolean) => {
    if (!open || filtered.current) {
      return;
    }
    filtered.current = true;
    setLoading(true);
    const fonts = data.filter(
      (item) => ['reset', 'custom'].includes(item.value) || support(item.value)
    );
    setLoading(false);
    fonts.length > 0 && setItems(fonts);
  };

  useEffect(() => {
    if (!items || !value) {
      return;
    }
    let initCustom = false;
    each(items, function (group) {
      const items = group.items;
      if (items) {
        each(items, function (item) {
          if (item.value === value) {
            initCustom = true;
            return true;
          }
          return;
        });
      } else {
        if (group.value === value) {
          initCustom = true;
          return true;
        }
      }
      return;
    });
    !initCustom && setCustomValue(value);
  }, [items, value]);

  useEffect(() => {
    if (!custom) {
      return;
    }
    // @ts-ignore
    inputRef && inputRef.current && inputRef.current.focus();
  }, [custom]);

  const selectValue = customValue || value || defaultValue;

  return custom ? (
    <Input
      style={{ width }}
      ref={inputRef}
      value={customValue}
      onBlur={handleInputBlur}
      placeholder={placeholder}
      onChange={handleInputChange}
      onPressEnter={handleInputPress}
    />
  ) : (
    <Select
      data={items}
      width={width}
      loading={loading}
      value={selectValue}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={handleSelectChange}
      onDropdownVisibleChange={handleVisibleChange}
    />
  );
}
