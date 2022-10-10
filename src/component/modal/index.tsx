import { Modal } from 'antd';
import each from '@/utils/each';
import useApp from '@/hooks/useApp';
import maxZindex from '@/utils/zindex';
import React, { useEffect } from 'react';

export default function (props: any) {
  const { children, visible, ...resetProps } = props;
  const { app, root } = useApp(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setTimeout(function () {
      each(root.querySelectorAll('.ant-modal-wrap'), (target) => {
        target.style.zIndex = maxZindex();
      });
    }, 100);
  }, [visible]);

  return (
    <Modal
      centered
      open={visible}
      maskClosable={false}
      okText={app.i10n('ok')}
      getContainer={() => root}
      cancelText={app.i10n('cancel')}
      {...resetProps}
    >
      {children}
    </Modal>
  );
}
