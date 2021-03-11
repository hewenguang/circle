import React, { useState, useEffect } from 'react';

export default function(props){
  const { active, children } = props;
  const [ visited, setVisited ] = useState(false);

  useEffect(() => {
    active && setVisited(true);
  }, [ active ]);

  return (active || visited) ? children : null;
}
