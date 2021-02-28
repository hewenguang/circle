import React, { useState, useEffect } from 'react';
import Layout from './layout';
import Welcome from './welcome';
import { count } from './action/table';

export default function(){
  const [ num, setNum ] = useState(-1);

  useEffect(() => {
    count('plugin').then((data = 0) => {
      setNum(data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  if(num < 0){
    return null;
  }

  if(num < 3){
    return <Welcome />;
  }

  return <Layout />;
}
