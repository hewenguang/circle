import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import React, { useRef, useState, useEffect } from 'react';

interface IProps {
  title: string;
  className?: string;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  getPopupContainer?: () => HTMLElement;
}

export default function (props: IProps) {
  const { getPopupContainer, title, className, placement, children } = props;
  const container = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!container || !container.current) {
      return;
    }
    const target = container.current;
    if (target.scrollWidth > target.clientWidth) {
      setVisible(true);
    }
  }, []);

  return (
    <Tooltip
      placement={placement}
      title={visible ? title : null}
      getPopupContainer={getPopupContainer}
    >
      <span title={title} ref={container} className={className}>
        {children}
      </span>
    </Tooltip>
  );
}
