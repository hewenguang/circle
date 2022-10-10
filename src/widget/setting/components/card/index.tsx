import React from 'react';
import App from '@/core/app.class';
import { isString } from '@/utils/is';
import { Card, Space, Button, Tooltip } from 'antd';
import { ButtonProps } from 'antd/es/button';
import './index.less';

interface IProps {
  app: App;
  tooltip: string;
  title: string;
  data: Array<{
    title: string;
    path?: string;
    img?: string;
    type?: ButtonProps['type'];
  }>;
}

export default function (props: IProps) {
  const { app, title, tooltip, data } = props;

  return (
    <Card bordered={false} title={title}>
      {tooltip && <p>{tooltip}</p>}
      {data && (
        <Space wrap>
          {data.map((item) => {
            if (item.img) {
              return (
                <Tooltip
                  key={item.title}
                  placement="bottom"
                  overlayClassName="card-overlay"
                  title={<img alt={item.title} src={item.img} />}
                >
                  <Button type={item.type}>{item.title}</Button>
                </Tooltip>
              );
            }
            return (
              <Button
                type={item.type}
                key={item.title}
                target="_blank"
                href={
                  isString(item.path) && !(item.path || '').startsWith('http')
                    ? app.path(item.path)
                    : item.path
                }
              >
                {item.title}
              </Button>
            );
          })}
        </Space>
      )}
    </Card>
  );
}
