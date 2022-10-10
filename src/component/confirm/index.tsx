import React from 'react';
import { Popconfirm } from 'antd';
import useApp from '@/hooks/useApp';
import './index.less';

export default function (props: any) {
  const { children, ...resetProps } = props;
  const app = useApp();

  return (
    <Popconfirm
      okText={app.i10n('ok')}
      cancelText={app.i10n('cancel')}
      overlayClassName="overlay-confirm"
      title={app.i10n('reset_confirm')}
      {...resetProps}
    >
      {children}
    </Popconfirm>
  );
}
