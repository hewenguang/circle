import React from 'react';
import Main from './main';

interface IProps {
  id: string;
  data?: Array<any>;
  activeKeys: Array<string>;
}

export default function (props: IProps) {
  return <Main {...props} />;
}
