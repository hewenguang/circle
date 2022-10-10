import React from 'react';
import cx from 'classnames';
import * as Icon from '@/component/icon';
import OverflowTooltip from '@/component/overflowtooltip';

interface IProps {
  root: HTMLElement;
  icon?: string;
  title: string;
  active: boolean;
}

export default function (props: IProps) {
  const { root, icon, title, active } = props;
  const Children = icon && Icon[icon] ? Icon[icon] : null;

  return (
    <OverflowTooltip
      title={title}
      placement="left"
      className={cx({
        twinkle: active,
      })}
      getPopupContainer={() => root}
    >
      {Children && <Children />}
      {title}
    </OverflowTooltip>
  );
}
