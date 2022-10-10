import React from 'react';
import { Tooltip } from 'antd';
import useApp from '@/hooks/useApp';
import copy from 'copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';

export default function (props: any) {
  const { text } = props;
  const app = useApp();
  const disabled = !text;
  const handleClick = () => {
    if (disabled) {
      return;
    }
    const type = copy(text) ? 'success' : 'fail';
    app.fire('notice', {
      duration: 1,
      message: app.i10n(`copy_${type}`),
      type: type === 'success' ? type : 'error',
    });
  };

  return (
    <Tooltip title={app.i10n('copy')}>
      <CopyOutlined
        onClick={handleClick}
        style={disabled ? { color: '#ccc' } : undefined}
      />
    </Tooltip>
  );
}
