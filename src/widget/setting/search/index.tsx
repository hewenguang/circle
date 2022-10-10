import React from 'react';
import { Input } from 'antd';
import wait from '@/utils/wait';
import { SearchOutlined } from '@ant-design/icons';
import './index.less';

export default function (props: any) {
  const { app, defaultValue, onChange } = props;
  const handleChange = (event: any) => {
    wait(() => {
      onChange && onChange(event.target.value);
    }, 600);
  };

  return (
    <Input
      allowClear
      className="search"
      onChange={handleChange}
      defaultValue={defaultValue}
      prefix={<SearchOutlined />}
      placeholder={app.i10n('search_in_setting')}
    />
  );
}
