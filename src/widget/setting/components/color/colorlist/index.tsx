import React from 'react';
import cx from 'classnames';
import EditOutlined from '@ant-design/icons/EditOutlined';
import './index.less';

type Item = {
  title: string;
  value?: object;
  data?: React.CSSProperties;
};

export default function (props: any) {
  const { text, extra, data = [], disabled, value, onChange } = props;
  const handleClick = (item: Item) => {
    !disabled && onChange && onChange(item.title, item.value);
  };
  const handleKeyPress = (item: Item, event: any) => {
    if (event.key !== 'Enter') {
      return;
    }
    !disabled && onChange && onChange(item.title, item.value);
  };

  return (
    <ul className="color-list">
      {data.map((item: Item) => (
        <li
          tabIndex={0}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/role-has-required-aria-props
          role="radio"
          key={item.title}
          onClick={handleClick.bind(null, item)}
          onKeyPress={handleKeyPress.bind(null, item)}
          style={item.title === 'custom' ? undefined : item.data}
          className={cx({
            active: item.title === value,
            custom: item.title === 'custom',
          })}
        >
          {item.title === 'custom' ? (
            <EditOutlined className="custom-icon" />
          ) : (
            text
          )}
        </li>
      ))}
      {extra && (
        <li key="extra" className="color-extra">
          {extra}
        </li>
      )}
    </ul>
  );
}
