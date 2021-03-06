import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import './index.less';

export default function(props){
  const { value, onChange, placeholder, className } = props;
  const [ val, setVal ] = useState(value);

  useEffect(() => setVal(value), [value]);

  return (
    <textarea
      value={val}
      placeholder={placeholder}
      className={cx('cc-textarea', className)}
      onChange={event => setVal(event.target.value)}
      onBlur={event => {
        onChange && onChange(event.target.value);
      }}
    />
  );
}
