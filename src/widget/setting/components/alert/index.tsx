import React from 'react';
import { Alert } from 'antd';
import useOption from '@/hooks/useOption';
import { CloseOutlined } from '@ant-design/icons';
import Confirm from '@/component/confirm';
import './index.less';

export default function (props: any) {
  const { id, message, title, placement = 'rightTop' } = props;
  const [value, change] = useOption({
    id: `${id}_alert`,
    defaultValue: false,
  });
  const handleConfirm = () => {
    change(true);
  };

  if (value) {
    return null;
  }

  return (
    <Alert
      message={message}
      className="alert"
      action={
        <Confirm title={title} placement={placement} onConfirm={handleConfirm}>
          <CloseOutlined />
        </Confirm>
      }
    />
  );
}
