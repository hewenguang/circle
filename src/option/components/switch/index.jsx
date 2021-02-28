import React from 'react';
import cx from 'classnames';
import './index.less';

export default function(props){
  const { disabled, checked, onChange, className } = props;

  return (
    <div className={cx('circle-switch', className, { checked, disabled })}>
      <label className="circle-switch-bar">
        <div className="circle-switch-drag" />
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="circle-switch-input"
          onChange={event => {
            onChange && onChange(event.target.checked);
          }}
        />
      </label>
    </div>
  );
}
