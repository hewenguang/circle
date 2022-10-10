import log from '@/log';
import useApp from './useApp';
import { useState, useEffect } from 'react';

interface IProps {
  table?: string;
  defaultLimit?: number;
  defaultSearch?: string;
  searchIn?: string | Array<string>;
  defaultMatch?: {
    [index: string]: string | boolean | Array<string>;
  };
}

export default function (props: IProps): any {
  const {
    table = 'setting',
    searchIn = 'title',
    defaultLimit = 5,
    defaultMatch = {},
    defaultSearch = '',
  } = props;
  const app = useApp();
  const [start, setStart] = useState(1);
  // const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState(defaultMatch);
  const [limit, setLimit] = useState(defaultLimit);
  const [search, setSearch] = useState(defaultSearch);
  const [data, setData] = useState({
    items: [],
    start: 0,
    limit: 0,
    total: 0,
    search,
  });

  const refetch = () => {
    // setLoading(true);
    app
      .option({
        table,
        origin: true,
        value: 'query',
        query: {
          match,
          search,
          searchIn,
          field: 'changed',
          keyRange: 'all',
        },
        pager: {
          start,
          limit,
        },
      })
      .then((data: any) => {
        data && setData(data);
      })
      .catch((error: string) => {
        log(error);
      });
    // .finally(() => {
    //   setLoading(false);
    // });
  };

  useEffect(refetch, [start, limit, search, match]);

  return [
    {
      ...data,
      match,
      // loading,
    },
    {
      refetch,
      start: setStart,
      limit: setLimit,
      match: setMatch,
      search: setSearch,
      // loading: setLoading,
      query: {
        match,
        start,
        limit,
        search,
        table,
        searchIn,
      },
    },
  ];
}
