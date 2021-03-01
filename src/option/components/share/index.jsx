import React, { useRef, useEffect } from 'react';
import './index.less';

export default function(){
  const container = useRef(null);

  useEffect(() => {
    container && container.current && socialShare(container.current, {
      url: 'https://ranhe.xyz/circle',
      title: '让网页赏心悦目、让阅读回归初心 - Circle 还你最纯粹的阅读体验，为你更好的阅读保驾护航',
      image: 'https://ranhe.xyz/post-images/1613019066732.png',
      description: '广告太多分散注意力、配色太丑不忍直视、字体太小看不清、排版太乱找不到正文，阅读真的需要这么困难吗？Circle 还你最纯粹的阅读体验，为你更好的阅读保驾护航',
      sites: ['wechat', 'qq', 'qzone', 'weibo', 'douban', 'linkedin', 'facebook', 'twitter', 'google'],
    });
  }, []);

  return (
    <div
      ref={container}
      className="cc-share"
    />
  );
}
