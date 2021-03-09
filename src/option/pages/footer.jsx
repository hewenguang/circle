import React, { useState, useEffect } from 'react';
import { get } from './action/table';

export default function(){
  const [ version, setVersion  ] = useState('--');

  useEffect(() => {
    get('option', 'version').then(data => {
      setVersion(`${api.i18n.getMessage('contextMenuName')} v${data}`);
    });
  }, []);

  return (
    <div className="option-footer">{version}</div>
  );
}
