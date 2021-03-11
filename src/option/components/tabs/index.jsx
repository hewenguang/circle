import cx from 'classnames';
import React, { useState } from 'react';
import Tab from './tab';
import './index.less';

export default function(props){
  const { className, options } = props;
  const keys = Object.keys(options);
  const [ tab, setTab ] = useState(keys[0]);

  return (
    <div className={cx('option-tabs', className)}>
      <ul className="option-tabs-header">
        {keys.map(key => (
          <li
            key={key}
            onClick={() => setTab(key)}
            className={cx({active: key === tab})}
          >
            {options[key].title}
          </li>
        ))}
      </ul>
      <div className="option-tabs-body">
        {keys.map(key => (
          <div
            key={key}
            style={{display: key === tab ? 'block':'none'}}
          >
            <Tab active={key === tab}>{options[key].value}</Tab>
          </div>
        ))}
      </div>
    </div>
  );
}
