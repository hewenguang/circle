import React from 'react';
import cx from 'classnames';
import { List } from 'antd';
import { isFunction, isUndefined } from '@/utils/is';
import Title from '../title';

export default function (props: any) {
  const {
    field,
    className,
    data = [],
    activeKeys = [],
    renderItem,
    children,
    itemStyle,
    ...resetProps
  } = props;

  return (
    <List
      {...resetProps}
      dataSource={data}
      className={cx(field, className)}
      renderItem={(item: any, index: number) => {
        const { type, title, min, max, id, hiddenLabel } = item;
        const slider = !isUndefined(min) || !isUndefined(max);
        const uuid = id || '';
        return (
          <List.Item
            style={itemStyle}
            key={`${field}_${uuid}_${index}`}
            className={cx(uuid, {
              'no-id': isUndefined(id),
              twinkle: activeKeys.includes(`${field}_${uuid}`),
              [type || 'slider']: (type && type !== uuid) || slider,
            })}
          >
            {isFunction(children) ? (
              children(item)
            ) : (
              <>
                {!slider && title && !hiddenLabel && <Title {...item} />}
                {renderItem && renderItem(item)}
              </>
            )}
          </List.Item>
        );
      }}
    />
  );
}
