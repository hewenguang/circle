import React from 'react';
import Switch from 'src/option/components/switch';

export default function(props){
  const { value, onChange, children } = props;

  return (
    <div
      className="option-item"
      onClick={() => onChange(!value)}
    >
      {children}
      <div className="option-buttons">
        <Switch checked={value} />
      </div>
    </div>
  );
}
