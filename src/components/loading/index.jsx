import React from 'react';
import cx from 'classnames';
import './index.less';

export default function(props){
  const { children, float } = props;

  return (
    <div
      className={cx('cc-loading', {
        'cc-loading-float': float,
      })}
    >
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M813.696 813.696c166.613333-166.613333 166.613333-436.778667 0-603.392-166.613333-166.613333-436.778667-166.613333-603.392 0A64 64 0 0 0 300.8 300.8a298.666667 298.666667 0 1 1 422.4 422.4 64 64 0 0 0 90.496 90.496z" />
      </svg>
      {children}
    </div>
  );
}
