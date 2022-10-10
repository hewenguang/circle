import React from 'react';
import useOption from '@/hooks/useOption';
import Colorlist from './colorlist';
import './index.less';

export default function (props: any) {
  const { data, id, darkmode, disabled, onChange } = props;
  const [option, optionChange] = useOption({
    defaultValue: data[0].title,
    id: darkmode ? `${id}_${darkmode}` : id,
  });
  const handleChange = (name: string, values: object) => {
    optionChange(name);
    values && onChange(values);
  };

  return (
    <Colorlist
      text="A"
      data={data}
      value={option}
      disabled={disabled}
      onChange={handleChange}
    />
  );
}
