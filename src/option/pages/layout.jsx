import React, { useState } from 'react';
import cx from 'classnames';
import Alert from 'src/option/components/alert';
import Share from 'src/option/components/share';
import Basic from './basic';
import Plugin from './plugin';

export default function(){
  const [ tab, setTab ] = useState('basic');
  const list = {
    basic: {
      title: api.i18n.getMessage('basic_setting'),
      value: <Basic />
    },
    plugin: {
      title: api.i18n.getMessage('plugin_manage'),
      value: <Plugin />
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
      <Alert className="option-alert">
        {api.i18n.getMessage('alert_msg')}
      </Alert>
      <Share />
      <div className="option-main">
        {list[tab].value}
      </div>
    </div>
  );
}
