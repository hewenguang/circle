import log from '@/log';
import { Pagination } from 'antd';
import App from '@/core/app.class';
import React, { useState, useEffect } from 'react';
import { PaginationProps } from 'antd/es/pagination';
import './index.less';

interface IPaginationProps extends PaginationProps {
  app: App;
  table?: string;
  start: number;
  limit: number;
  search?: string;
  match?: {
    [index: string]: string | Array<string>;
  };
  searchIn?: string | Array<string>;
  onChange: (current: number) => void;
}

export default function (props: IPaginationProps) {
  const {
    app,
    match,
    start,
    limit,
    search,
    onChange,
    simple = true,
    size = 'small',
    table = 'setting',
    searchIn = 'title',
    ...resetProps
  } = props;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    app
      .option({
        table,
        origin: true,
        value: 'queryCount',
        query: {
          match,
          search,
          searchIn,
          field: 'changed',
          keyRange: 'all',
        },
      })
      .then((data: number) => {
        setTotal(data || 0);
      })
      .catch((error: string) => {
        log(error);
      });
  }, [search, match]);

  if (total <= 0) {
    return null;
  }

  return (
    <Pagination
      {...resetProps}
      size={size}
      total={total}
      simple={simple}
      current={start}
      pageSize={limit}
      onChange={onChange}
      className="pagination"
    />
  );
}
