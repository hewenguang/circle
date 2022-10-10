import React from 'react';
import { Drawer, Modal } from 'antd';

export default function (props: any) {
  const { type, root, children, onClose, ...resetProps } = props;

  if (type === 'toolbar') {
    return (
      <Drawer
        {...resetProps}
        onClose={onClose}
        className="drawer-toolbar"
        getContainer={() => root}
      >
        {children}
      </Drawer>
    );
  }

  if (type === 'modal') {
    return (
      <Modal {...resetProps} onCancel={onClose} className="drawer-modal">
        {children}
      </Modal>
    );
  }

  return (
    <Drawer {...resetProps} onClose={onClose} getContainer={() => root}>
      {children}
    </Drawer>
  );
}
