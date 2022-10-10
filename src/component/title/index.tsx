import React from 'react';
import useApp from '@/hooks/useApp';
import { isString } from '@/utils/is';
import { Tooltip, Button } from 'antd';
import * as Icon from '@/component/icon';
import { QuestionCircleOutlined } from '@ant-design/icons';

type Placement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight';

interface IProps {
  icon?: string;
  title: string;
  tooltip?: string;
  learn_more?: string;
  placement?: Placement;
  labelTooltip?: string;
}

export default function (props: IProps) {
  const { icon, title, tooltip, placement, learn_more, labelTooltip } = props;

  if (labelTooltip) {
    return (
      <Tooltip placement={placement} title={labelTooltip}>
        <label>{title}</label>
      </Tooltip>
    );
  }

  const app = useApp();
  const Children = icon && Icon[icon] ? Icon[icon] : null;

  return (
    <label>
      {Children && <Children style={{ marginRight: 3 }} />}
      {title}
      {tooltip && (
        <Tooltip
          placement={placement}
          title={
            <>
              {tooltip}
              {learn_more && (
                <Button
                  type="link"
                  target="_blank"
                  style={{ marginLeft: 3 }}
                  href={
                    isString(learn_more) && !learn_more.startsWith('http')
                      ? app.path(learn_more)
                      : learn_more
                  }
                >
                  {app.i10n('learn_more')}
                </Button>
              )}
            </>
          }
        >
          <QuestionCircleOutlined style={{ marginLeft: 3 }} />
        </Tooltip>
      )}
    </label>
  );
}
