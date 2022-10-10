import { saveAs } from 'file-saver';
import React, { useState } from 'react';
import useApp from '@/hooks/useApp';
import { Button, Checkbox, Space } from 'antd';

interface IProps {
  id: string;
  title: string;
  data?: Array<{
    id: string;
    title: string;
  }>;
}

export default function (props: IProps) {
  const { title, data = [] } = props;
  const app = useApp();
  const defaultCheckedList = data.map((item) => item.id);
  const [loading, setLoading] = useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
  const handleChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(
      list.length > 0 && list.length < defaultCheckedList.length
    );
  };
  const onCheckAllChange = (event: any) => {
    setCheckedList(event.target.checked ? defaultCheckedList : []);
    setIndeterminate(false);
  };
  const handleExport = () => {
    setLoading(true);
    app.send(
      'export',
      {
        tables: checkedList,
      },
      (error: string, data: any) => {
        setLoading(false);
        if (error) {
          app.fire('notice', {
            type: 'error',
            message: error,
            key: 'export',
          });
          return;
        }
        saveAs(
          new Blob([JSON.stringify(data)], {
            type: 'text/plain;charset=utf-8',
          }),
          `db_${Date.now()}.circle`
        );
      }
    );
  };

  return (
    <div className="export">
      <Checkbox
        onChange={onCheckAllChange}
        indeterminate={indeterminate}
        checked={checkedList.length === defaultCheckedList.length}
      >
        {app.i10n('select_all')}
      </Checkbox>
      <Checkbox.Group
        value={checkedList}
        onChange={handleChange}
        style={{ margin: '6px 0px 10px' }}
      >
        <Space wrap>
          {data.map((item) => (
            <Checkbox key={item.id} value={item.id}>
              {item.title}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
      <Button
        block
        size="middle"
        loading={loading}
        onClick={handleExport}
        disabled={checkedList.length <= 0}
      >
        {title}
      </Button>
    </div>
  );
}
