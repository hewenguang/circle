import React from 'react';
import cx from 'classnames';
import './index.less';

export default function(props){
  const { disabled, checked, onChange, className } = props;

  return (
    <div className={cx('cc-switch', className, { checked, disabled })}>
      <label className="cc-switch-bar">
        <div className="cc-switch-drag" />
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="cc-switch-input"
          onChange={event => {
            onChange && onChange(event.target.checked);
          }}
        />
      </label>
    </div>
  );
}
