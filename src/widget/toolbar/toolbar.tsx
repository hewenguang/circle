import React from 'react';
import cx from 'classnames';
import { Tooltip } from 'antd';
import App from '@/core/app.class';
import * as Icons from '@/component/icon';
import { LoadingOutlined } from '@ant-design/icons';

export interface Toolbar {
  icon: string;
  group: number;
  priority: number;
  name: string;
  id: string;
  title: string;
  color?: string;
  active?: boolean;
  checked?: boolean;
  loading?: boolean;
  hidden?: boolean;
}

interface IProps extends Toolbar {
  app: App;
}

export default function (props: IProps) {
  const { app, icon, id, title, color, active, loading } = props;
  const handleClick = () => {
    if (loading) {
      return;
    }
    app.fire(id);
  };

  const Children = loading ? LoadingOutlined : Icons[icon];

  if (!Children) {
    return null;
  }

  return (
    <Tooltip
      placement="right"
      mouseEnterDelay={0.7}
      title={app.data('mobile') ? null : title}
    >
      <Children
        style={{ color }}
        onClick={handleClick}
        className={cx(id, { active })}
      />
    </Tooltip>
  );
}
