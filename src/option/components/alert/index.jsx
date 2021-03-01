import React from 'react';
import cx from 'classnames';
import './index.less';

export default function(props){
  const { children, className } = props;

  return (
    <div className={cx('cc-alert', className)}>
      {children}
    </div>
  );
}
