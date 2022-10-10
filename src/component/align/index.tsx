import React from 'react';
import Align from 'rc-align';
import cx from 'classnames';
import { AlignProps } from 'rc-align/es/Align';
import './index.less';

export interface IProps {
  className?: string;
  visible: boolean;
  targetOffset?: Array<number>;
  target: AlignProps['target'];
  children: AlignProps['children'];
  onMouseLeave?: (event: any) => void;
  onMouseEnter?: (event: any) => void;
}

export default function (props: IProps) {
  const {
    onMouseLeave,
    onMouseEnter,
    className,
    visible,
    children,
    targetOffset = [20, 20],
    ...resetProps
  } = props;

  return (
    <Align
      monitorWindowResize
      align={{
        points: ['bc', 'cc'],
        targetOffset: targetOffset,
        // @ts-ignore
        overflow: { adjustX: true, adjustY: true, alwaysByViewport: true },
      }}
      {...resetProps}
    >
      <div
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        className={cx('dom-align', className)}
        style={{
          position: 'absolute',
          display: visible ? 'inline-block' : 'none',
        }}
      >
        {children}
      </div>
    </Align>
  );
}
