import { ConfigProvider } from 'antd';
import React, { useEffect } from 'react';
import Mobile from './mobile';
import useToolbar from './useContext';
import ToolbarCore, { Toolbar } from './toolbar';

export default function ({ app, root }: any) {
  const toolbars = useToolbar(app);

  useEffect(() => {
    setTimeout(() => {
      app.fire('toolbar_ready');
    }, 100);
  }, []);

  return (
    <ConfigProvider getPopupContainer={() => root}>
      <div className="toolbar">
        {Object.keys(toolbars).map((key) => {
          const items = toolbars[key].filter((item: Toolbar) => !item.hidden);
          if (items.length <= 0) {
            return null;
          }
          return (
            <div key={key} className="items">
              {items.map((item: Toolbar) => (
                <ToolbarCore {...item} key={item.id} app={app} />
              ))}
            </div>
          );
        })}
        <Mobile app={app} />
      </div>
    </ConfigProvider>
  );
}
