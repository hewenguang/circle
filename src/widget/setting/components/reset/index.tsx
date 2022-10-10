import React from 'react';
import { Button } from 'antd';
import wait from '@/utils/wait';
import useApp from '@/hooks/useApp';
import Confirm from '@/component/confirm';

interface IProps {
  title: string;
}

export default function (props: IProps) {
  const { title } = props;
  const app = useApp();
  const handleConfirm = () => {
    app.send('reset', (error: string) => {
      if (error) {
        app.fire('notice', {
          type: 'error',
          message: error,
          key: 'reset',
        });
        return;
      }
      wait(function () {
        location.reload();
      }, 1000);
    });
  };

  return (
    <Confirm placement="top" onConfirm={handleConfirm}>
      <Button block danger size="middle">
        {title}
      </Button>
    </Confirm>
  );
}
