import React from 'react';
import { isUndefined } from '@/core/is';
import * as Icons from '@/component/icon';
import ColorPicker from '@/component/colorpicker';
import { CloseCircleFilled } from '@ant-design/icons';

interface IProps {
  color?: string;
  icon?: string;
  disabled?: boolean;
  onClose?: () => void;
  onChange?: (value: any) => void;
}

export default function (props: IProps) {
  const { color, icon, onChange, onClose, disabled } = props;
  const Children = icon && Icons[icon] ? Icons[icon] : null;

  return (
    <div className="icon-switch-children">
      {Children && <Children className="item-icon" style={{ color }} />}
      <ColorPicker value={color} disabled={disabled} onChange={onChange} />
      {!isUndefined(color) && (
        <CloseCircleFilled
          style={{ color }}
          onClick={onClose}
          className="close-icon"
        />
      )}
    </div>
  );
}
