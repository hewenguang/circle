import App from '@/core/app.class';
import Modal from '@/component/modal';
import { Button, Input, Form } from 'antd';
import React, { useRef, useEffect } from 'react';

export interface Item {
  width?: string | number;
  title?: string;
  field: string;
  hidden?: boolean;
  type?: string;
  disabled?: boolean;
}

interface IProps {
  app: App;
  data: Array<any>;
  value: any;
  title?: string;
  onClick: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function (props: IProps) {
  const { app, data, value, title, onClick, onCancel, onSubmit } = props;
  const update = value && value.id;
  const form = useRef<any>(null);
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const handleSubmit = () => {
    form.current && form.current.validateFields().then(onSubmit);
  };

  useEffect(() => {
    if (!value || Object.keys(value).length <= 0) {
      form.current && form.current.resetFields();
      return;
    }
    form.current && form.current.setFieldsValue(value);
  }, [value]);

  return (
    <>
      <Button type="primary" onClick={onClick}>
        {app.i10n('add')}
      </Button>
      <Modal
        width={430}
        visible={!!value}
        className="modal"
        onOk={handleSubmit}
        onCancel={handleCancel}
        title={`${app.i10n(update ? 'edit' : 'add')}${title}`}
      >
        <Form
          ref={form}
          initialValues={value}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
        >
          {data
            .filter((item: Item) => item.field !== 'action')
            .map((item: Item) => (
              <Form.Item
                key={item.field}
                name={item.field}
                label={item.title}
                hidden={item.hidden}
                rules={[
                  {
                    required: !item.hidden,
                    message: app.i10n('required'),
                  },
                ]}
              >
                <Input
                  allowClear
                  disabled={update && item.disabled}
                  type={item.type && !item.hidden ? item.type : 'text'}
                />
              </Form.Item>
            ))}
        </Form>
      </Modal>
    </>
  );
}
