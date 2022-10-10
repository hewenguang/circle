import React from 'react';
import { Input } from 'antd';
import wait from '@/utils/wait';
import { SearchOutlined } from '@ant-design/icons';

export default function (props: any) {
  const { defaultValue, placeholder, onChangeDone } = props;
  const handleChange = (event: any) => {
    wait(() => {
      onChangeDone && onChangeDone(event.target.value);
    });
  };

  return (
    <Input
      onChange={handleChange}
      placeholder={placeholder}
      defaultValue={defaultValue}
      prefix={<SearchOutlined />}
    />
  );
}
