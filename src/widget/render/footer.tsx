import App from '@/core/app.class';
import React, { useState, useEffect } from 'react';

interface IProps {
  app: App;
}

export default function ({ app }: IProps) {
  const [display, setDisplay] = useState('block');

  useEffect(() => {
    function init() {
      app.option('layout').then((data: any) => {
        setDisplay(data && data.removefooter ? 'none' : 'block');
      });
    }
    init();
    // 移除页脚
    return app.on('layout_removefooter', init);
  }, []);

  return (
    <div className="footer notranslate" style={{ display }}>
      <ul className="link">
        {[
          {
            url: app.path(),
            title: app.i10n('website'),
          },
          {
            url: app.path('download'),
            title: app.i10n('download_latest'),
          },
          {
            url: app.path('feedback'),
            title: app.i10n('feedback'),
          },
          {
            url: app.path('donate'),
            title: `${app.i10n('donate')} ❤️`,
          },
        ].map((link) => (
          <li key={link.url}>
            <a target="_blank" href={link.url} rel="noreferrer">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="copyright">
        {app.i10n('copyright', location.hostname)}
      </div>
    </div>
  );
}
