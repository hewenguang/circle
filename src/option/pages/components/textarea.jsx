import React from 'react';
import cx from 'classnames';
import Textarea from  'src/components/textarea';

export default function(props){
  const { className, value, onChange, children, placeholder } = props;

  return (
    <div className={cx('option-item option-textarea', className)}>
      {children}
      <div className="option-buttons">
        <Textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
