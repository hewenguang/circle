import log from '@/log';
import App from '@/core/app.class';
import { Button, Input } from 'antd';
import Modal from '@/component/modal';
import React, { useState } from 'react';
import { format, parser } from './utils';

interface IProps {
  app: App;
  state: boolean;
  table: string;
  title?: string;
  onRefresh: () => void;
}

export default function (props: IProps) {
  const { app, state, table, title, onRefresh } = props;
  const [value, onChange] = useState('');
  const [visible, setVisible] = useState(false);
  const getData = () => {
    return app.option({
      table,
      value: 'query',
      query: {
        match: {
          deny: !!state,
        },
        field: 'changed',
        keyRange: 'all',
      },
    });
  };
  const handleClick = () => {
    getData()
      .then((data: any) => {
        onChange(format(data));
        setVisible(true);
      })
      .catch((error: string) => {
        log(error);
      });
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };
  const handleSubmit = () => {
    const data = parser(value, state);
    if (data.length > 0) {
      app.send('import', { data: { [table]: data } }, (error?: string) => {
        if (error) {
          app.fire('notice', {
            type: 'error',
            message: error,
          });
          return;
        }
        setVisible(false);
        onRefresh && onRefresh();
      });
    } else {
      getData()
        .then((data: any) => {
          if (data.length <= 0) {
            setVisible(false);
            onRefresh && onRefresh();
            return;
          }
          return app.send('db', {
            table,
            action: 'deleteMultiple',
            value: data.map(
              (item: { id: string | number; nid: string | number }) => ({
                id: item.id,
                nid: item.nid,
              })
            ),
          });
        })
        .then(() => {
          setVisible(false);
          onRefresh && onRefresh();
        })
        .catch((error: string) => {
          app.fire('notice', {
            type: 'error',
            message: error,
          });
        });
    }
  };

  return (
    <>
      <Button onClick={handleClick}>{app.i10n('batch')}</Button>
      <Modal
        width={560}
        title={title}
        destroyOnClose
        visible={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        bodyStyle={{ padding: 0 }}
      >
        <Input.TextArea
          rows={10}
          value={value}
          bordered={false}
          onChange={handleChange}
          style={{ whiteSpace: 'nowrap' }}
          placeholder={app.i10n('batch_rule')}
        />
      </Modal>
    </>
  );
}
