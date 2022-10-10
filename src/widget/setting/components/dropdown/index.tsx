import React from 'react';
import { Dropdown } from 'antd';

export default function (props: any) {
  const { children, ...resetProps } = props;

  return <Dropdown {...resetProps}>{children}</Dropdown>;
}
