import React, { useRef, useEffect } from 'react';
import './index.less';

export default function(){
  const container = useRef(null);

  useEffect(() => {
    container && container.current && socialShare(container.current, {
      url: 'sss',
      title: '234',
      image: 'sss',
      description: '123',
      sites: ['wechat', 'qq', 'qzone', 'weibo', 'douban', 'linkedin', 'facebook', 'twitter', 'google'],
    });
  }, []);

  return (
    <div
      ref={container}
      className="circle-share"
    />
  );
}
