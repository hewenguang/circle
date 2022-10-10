import React from 'react';
import { Tag, Tooltip } from 'antd';

interface IProps {
  tag: string;
  closable?: boolean;
  onClose?: () => void;
  onClick?: (e: any) => void;
  className?: string;
  onDoubleClick?: (e: any) => void;
}

export default function (props: IProps) {
  const { tag, closable, onClose, onClick, className, onDoubleClick } = props;
  const isLongTag = tag.length > 20;
  const tagElem = (
    <Tag
      key={tag}
      onClose={onClose}
      onClick={onClick}
      closable={closable}
      className={className}
    >
      <span onDoubleClick={onDoubleClick}>
        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
      </span>
    </Tag>
  );
  return isLongTag ? (
    <Tooltip key={tag} title={tag}>
      {tagElem}
    </Tooltip>
  ) : (
    tagElem
  );
}
