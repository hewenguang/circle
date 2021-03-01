import React from 'react';
import cx from 'classnames';
import './index.less';

export default function(props){
  const { className, style, percent } = props;
 
  return (
    <div style={style} className={cx('cc-progress', className)}>
      <div className="cc-progress-bar" style={{width: `${percent}%`}} />
    </div>
  );
}
