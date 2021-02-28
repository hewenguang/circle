import React from 'react';
import cx from 'classnames';
import './index.less';

export default function(props){
  const { className, style, percent } = props;
 
  return (
    <div style={style} className={cx('circle-progress', className)}>
      <div className="circle-progress-bar" style={{width: `${percent}%`}} />
    </div>
  );
}
