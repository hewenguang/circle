import React from 'react';
import cx from 'classnames';
import './index.less';

export default function(props){
  const { value, onChange, placeholder, className } = props;

  return (
    <textarea
      value={value}
      placeholder={placeholder}
      className={cx('cc-textarea', className)}
      onChange={event => {
        onChange && onChange(event.target.value);
      }}
    />
  );
}
