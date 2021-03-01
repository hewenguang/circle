import React, { useState, useEffect } from 'react';
import Layout from './layout';
import Welcome from './welcome';
import { get } from './action/table';

export default function(){
  const [ ready, setReady  ] = useState(undefined);

  useEffect(() => {
    get('option', 'version').then(data => {
      setReady(!!data);
    }).catch(() => {
      setReady(false);
    });
  }, []);

  if(typeof ready === 'undefined'){
    return null;
  }

  if(ready){
    return <Layout />;
  }

  return <Welcome />;
}
