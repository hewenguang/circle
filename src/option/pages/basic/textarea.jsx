import React from 'react';
import Textarea from  'src/option/components/textarea';

export default function(props){
  const { value, onChange, children, placeholder } = props;

  return (
    <div className="option-item option-textarea">
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
