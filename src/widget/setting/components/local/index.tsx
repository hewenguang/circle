import React from 'react';
import { Card } from 'antd';
import Sync_Import, { ImportProps } from './import';
import Sync_Export from './export';

interface IProps {
  title: string;
  data: Array<ImportProps>;
}

export default function (props: IProps) {
  const { title, data } = props;

  return (
    <Card bordered={false} title={title}>
      {data.map((item) => {
        switch (item.id) {
          case 'sync_export':
            return <Sync_Export {...item} key={item.id} />;
          case 'sync_import':
            return <Sync_Import {...item} key={item.id} />;
          default:
            return null;
        }
      })}
    </Card>
  );
}
