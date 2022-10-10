import React from 'react';
import cx from 'classnames';
import { Tabs } from 'antd';
import Title from '@/component/title';
import './index.less';

export default function (props: any) {
  const { extra, disabled, data, className, onChange, ...resetProps } = props;

  return (
    <Tabs
      {...resetProps}
      onTabClick={onChange}
      className={cx('tabs-inner', className)}
      tabBarExtraContent={extra && { left: extra }}
      items={data.map(
        (item: {
          key: string;
          title: string;
          value: string;
          data: object;
        }) => ({
          key: item.key,
          disabled,
          label: <Title title={item.title} />,
          children: item.value,
        })
      )}
    />
  );
}
