import React from 'react';
import cx from 'classnames';
import Loading from '../loading';
import './index.less';

export default function(props){
  const { type, href, loading, disabled, children, onClick, className, ...resetProps } = props;

  if(href){
    return (
      <a
        {...resetProps}
        href={href}
        target="_blank"
        disabled={disabled}
        className={cx('cc-button', className, type)}
      >
        {loading && <Loading />}
        {children}
      </a>
    );
  }

  return (
    <button
      {...resetProps}
      disabled={disabled}
      className={cx('cc-button', className, type, {loading})}
      onClick={() => {
        if(disabled || loading){
          return;
        }
        onClick && onClick();
      }}
    >
      {loading && <Loading />}
      {children}
    </button>
  );
}
