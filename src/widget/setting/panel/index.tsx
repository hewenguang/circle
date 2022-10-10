import React from 'react';
import Alone from './alone';
import Table from './table';
import Plugin from './plugin';
import sort from '@/utils/sort';
import Together from './together';
import './index.less';

export interface IPanelProps {
  active?: boolean; // 开启特效
  icon?: string;
  tooltip?: string;
  learn_more?: string;
  type?: string;
  table?: string;
  id: string;
  title: string;
  title1?: string;
  title2?: string;
  night?: boolean;
  enable?: boolean;
  priority: number;
  data?: Array<any>;
  reset?: boolean;
  theme?: boolean;
  activeKeys: Array<string>;
}

export default function (props: IPanelProps) {
  const {
    id,
    type,
    table,
    night,
    reset,
    title,
    title1,
    title2,
    theme,
    activeKeys,
  } = props;
  const data = sort(props.data);

  if (type === 'plugin') {
    return <Plugin data={data} id={id} activeKeys={activeKeys} />;
  }

  if (type === 'table' && table) {
    return (
      <Table
        data={data}
        title={title}
        table={table}
        title1={title1}
        title2={title2}
      />
    );
  }

  const items =
    (type
      ? (data || []).map((item) => ({
          type,
          ...item,
        }))
      : data) || [];

  if (table) {
    return (
      <Together
        id={id}
        reset={reset}
        table={table}
        data={items}
        activeKeys={activeKeys}
      />
    );
  }

  return (
    <Alone
      id={id}
      theme={theme}
      night={night}
      reset={reset}
      data={items}
      activeKeys={activeKeys}
    />
  );
}
