import React from 'react';
import cx from 'classnames';
import { Button } from 'antd';
import wait from '@/utils/wait';
import App from '@/core/app.class';
import Confirm from '@/component/confirm';
import './index.less';

interface IProps {
  app: App;
  ids: Array<string>;
  className?: string;
}

export default function (props: IProps) {
  const { ids, app, className } = props;
  const handleConfirm = () => {
    Promise.all(
      ids.map((id) =>
        app.option({
          name: id,
          value: 'remove',
        })
      )
    ).then(() => {
      wait(function () {
        location.reload();
      }, 1000);
    });
  };

  return (
    <Confirm title={app.i10n('reset_tooltip')} onConfirm={handleConfirm}>
      <Button block danger size="middle" className={cx('reset-btn', className)}>
        {app.i10n('reset')}
      </Button>
    </Confirm>
  );
}
