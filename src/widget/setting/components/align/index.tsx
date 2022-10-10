import React from 'react';
import Select from '../select';
import useApp from '@/hooks/useApp';
import './index.less';

export default function (props: any) {
  const { width = '100%', value, onChange, defaultValue = 'reset' } = props;
  const app = useApp();
  const data = [
    {
      title: app.i10n('default'),
      value: 'reset',
    },
    {
      title: app.i10n('align_left'),
      value: 'left',
    },
    {
      title: app.i10n('align_center'),
      value: 'center',
    },
    {
      title: app.i10n('align_right'),
      value: 'right',
    },
    {
      title: app.i10n('align_justify'),
      value: 'justify',
    },
  ];

  return (
    <Select
      data={data}
      width={width}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
    />
  );
}
