import App from '@/core/app.class';
import React, { useState, useEffect } from 'react';
import { DownOutlined, MenuOutlined } from '@ant-design/icons';

interface IProps {
  app: App;
}

export default function (props: IProps) {
  const { app } = props;
  const [collapse, setCollapse] = useState(false);
  const handleClick = () => setCollapse(!collapse);

  useEffect(() => {
    app.fire('toolbar_collapse', collapse);
  }, [collapse]);

  if (!app.data('mobile')) {
    return null;
  }

  return (
    <div className="items items-moible">
      {collapse ? (
        <DownOutlined className="mobile" onClick={handleClick} />
      ) : (
        <MenuOutlined className="mobile" onClick={handleClick} />
      )}
    </div>
  );
}
