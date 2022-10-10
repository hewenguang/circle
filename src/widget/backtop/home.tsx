import React from 'react';
import { BackTop, ConfigProvider } from 'antd';
import { UpCircleFilled } from '@ant-design/icons';

export default function ({ root }: any) {
  return (
    <ConfigProvider getPopupContainer={() => root}>
      <BackTop>
        <UpCircleFilled />
      </BackTop>
    </ConfigProvider>
  );
}
