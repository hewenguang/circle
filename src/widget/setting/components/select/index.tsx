import React from 'react';
import { Select } from 'antd';

const { Option, OptGroup } = Select;

export default function (props: any) {
  const {
    data,
    value,
    loading,
    onChange,
    placeholder,
    defaultValue,
    width = '100%',
    onDropdownVisibleChange,
  } = props;

  const selectValue = value || defaultValue;

  return (
    <Select
      loading={loading}
      style={{ width }}
      onChange={onChange}
      placeholder={placeholder}
      value={selectValue ? selectValue : undefined}
      onDropdownVisibleChange={onDropdownVisibleChange}
    >
      {data.map(
        (group: {
          title: string;
          value?: string;
          style?: React.CSSProperties;
          items: Array<{
            title: string;
            value: string;
            style?: React.CSSProperties;
          }>;
        }) => {
          const items = group.items;
          if (items) {
            return (
              <OptGroup
                key={group.title}
                style={group.style}
                label={group.title}
              >
                {items.map((item) => (
                  <Option
                    key={item.value}
                    value={item.value}
                    style={item.style}
                  >
                    {item.title}
                  </Option>
                ))}
              </OptGroup>
            );
          }
          return (
            <Option key={group.title} style={group.style} value={group.value}>
              {group.title}
            </Option>
          );
        }
      )}
    </Select>
  );
}
