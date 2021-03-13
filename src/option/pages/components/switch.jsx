import React from 'react';
import cx from 'classnames';
import Switch from 'src/components/switch';

export default function(props){
  const { className, value, onChange, children } = props;

  return (
    <div
      className={cx('option-item', className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onChange(!value);
      }}
    >
      {children}
      <div className="option-buttons">
        <Switch checked={value} />
      </div>
    </div>
  );
}
