import cx from 'classnames';
import React, { useState } from 'react';
import Footer from './footer';
import Basic from  './module/basic';
import Help from './module/help';

export default function(){
  const [ tab, setTab ] = useState('basic');
  const list = {
    basic: {
      title: api.i18n.getMessage('basic_setting'),
      value: <Basic />
    },
    help: {
      title: api.i18n.getMessage('help_center'),
      value: <Help />
    },
  };

  return (
    <div className="option-root">
      <ul className="option-header">
        {Object.keys(list).map(key => (
          <li
            key={key}
            onClick={() => setTab(key)}
            className={cx({active: key === tab})}
          >
            {list[key].title}
          </li>
        ))}
      </ul>
      {list[tab].value}
      <Footer />
    </div>
  );
}
