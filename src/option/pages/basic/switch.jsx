import React, { useState, useEffect } from 'react';
import Switch from 'src/option/components/switch';

export default function(props){
  const { name, children } = props;
  const [ checked, setChecked ] = useState(false);

  useEffect(() => {
    api.send('option', { execute: 'get', name }, function({error, data}){
      if(error){
        console.error(error);
        return;
      }
      setChecked(data);
    });
  }, []);

  return (
    <div
      className="option-item"
      onClick={() => {
        api.send('option', {
          name,
          value: !checked,
          execute: 'add',
        }, function({error}){
          if(error){
            console.error(error);
            return;
          }
          setChecked(!checked);
        });
      }}
    >
      {children}
      <div className="option-buttons">
        <Switch checked={checked} />
      </div>
    </div>
  );
}
