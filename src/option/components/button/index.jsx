import React from 'react';
import cx from 'classnames';
import Loading from '../loading';
import './index.less';

export default function(props){
  const { type, loading, disabled, children, onClick, className, ...resetProps } = props;

  return (
    <button
      {...resetProps}
      disabled={disabled}
      className={cx('circle-button', className, type)}
      onClick={() => {
        if(disabled){
          return;
        }
        onClick && onClick();
      }}
    >
      {loading ? <Loading /> : children}
    </button>
  );
}
