import React from 'react';
import Confirm from '@/component/confirm';
import { Space, Table, Switch } from 'antd';
import Pagination from '@/component/pagination';
import OverflowTooltip from '@/component/overflowtooltip';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Add from './add';
import Search from './search';
import useContext, { IProps } from './useContext';
import './index.less';

type Item = {
  width?: string | number;
  title?: string;
  field: string;
  hidden?: boolean;
};

export default function (props: IProps) {
  const { title1, title2, data: columns = [] } = props;
  const {
    app,
    data,
    match,
    query,
    start,
    editValue,
    handleEdit,
    handleCreate,
    handleCancel,
    handleDelete,
    handleSubmit,
    handleSearch,
  } = useContext(props);
  const state = data.match.deny;
  const title = state ? title2 : title1;

  return (
    <>
      <div className="ant-list-item">
        {title}
        <Switch
          checked={state}
          onChange={(checked: boolean) =>
            match({
              deny: checked,
            })
          }
        />
      </div>
      <div className="table-header">
        <Add
          app={app}
          title={title}
          data={columns}
          value={editValue}
          onClick={handleCreate}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
        <Search defaultValue={data.search} onChangeDone={handleSearch} />
      </div>
      <Table
        rowKey="id"
        pagination={false}
        dataSource={data.items}
        locale={{ emptyText: <div className="empty">{app.i10n('empty')}</div> }}
        columns={columns
          .filter((item: Item) => !item.hidden)
          .map((item: Item) =>
            item.field === 'action'
              ? {
                  key: item.field,
                  title: item.title,
                  dataIndex: item.field,
                  render: (val: string, record: any) => (
                    <Space
                      size="small"
                      direction="vertical"
                      style={{ lineHeight: 0 }}
                    >
                      <EditOutlined onClick={handleEdit.bind(null, record)} />
                      <Confirm
                        placement="left"
                        trigger={['click']}
                        onConfirm={handleDelete.bind(null, record)}
                        title={`${app.i10n('remove')} 《${record.title}》 ?`}
                      >
                        <DeleteOutlined />
                      </Confirm>
                    </Space>
                  ),
                }
              : {
                  key: item.field,
                  width: item.width,
                  title: item.title,
                  dataIndex: item.field,
                  render: (val: string) => (
                    <OverflowTooltip title={val} className="table-cell">
                      {val || '--'}
                    </OverflowTooltip>
                  ),
                }
          )}
      />
      <Pagination
        app={app}
        onChange={start}
        start={data.start}
        limit={data.limit}
        search={data.search}
        {...query}
      />
    </>
  );
}
