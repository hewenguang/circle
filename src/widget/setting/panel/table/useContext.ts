import useApp from '@/hooks/useApp';
import { isBoolean } from '@/core/is';
import useTable from '@/hooks/useTable';
import { useState, useEffect } from 'react';

export interface IProps {
  title: string;
  table: string;
  data?: Array<any>;
  title1?: string;
  title2?: string;
}

export default function (props: IProps) {
  const { table } = props;
  const app = useApp();
  const query = {
    table,
    searchIn: ['id', 'title'],
    defaultMatch: { deny: false },
  };
  const [editValue, setEditValue] = useState<any>(null);
  const [items, change] = useTable(query);

  useEffect(() => {
    return app.on('tab_activated', () => {
      change.refetch();
    });
  }, []);

  useEffect(() => {
    return app.on(`${table}_refetch`, () => {
      change.refetch();
    });
  }, []);

  return {
    ...change,
    app,
    query,
    editValue,
    data: items,
    handleCreate() {
      setEditValue({});
    },
    handleCancel() {
      setEditValue(null);
    },
    handleEdit(record: any) {
      setEditValue(record);
    },
    handleRefresh() {
      change.refetch();
    },
    handleSearch(val: string) {
      change.start(1);
      change.search(val);
    },
    handleDelete(record: any) {
      app
        .option({
          table,
          name: record.id,
          value: 'remove',
        })
        .then(() => {
          change.refetch();
          app.fire(`${table}_change`);
        });
    },
    handleSubmit(values: any) {
      const name = values.id;
      !isBoolean(values.deny) && (values.deny = !!items.match.deny);
      if (name) {
        delete values.id;
        app
          .option({
            name,
            table,
            value: values,
          })
          .then(() => {
            setEditValue(null);
            change.refetch();
            app.fire(`${table}_change`);
          });
        return;
      }
      app
        .option({
          table,
          value: values,
        })
        .then(() => {
          setEditValue(null);
          change.refetch();
          app.fire(`${table}_change`);
        });
    },
  };
}
