import React from 'react';
import LazySwitch from '../lazyswitch';
import Children from './children';
import './index.less';

interface IProps {
  value: {
    icon?: string;
    color?: string;
    checked?: boolean;
  };
  disabled?: boolean;
  onChange?: (value: any) => void;
}

export default function (props: IProps) {
  const { value = {}, onChange, disabled } = props;
  const handleColorChange = (color: string) => {
    onChange && onChange({ ...value, color });
  };
  const handleIconChange = () => {
    if (disabled) {
      return;
    }
    delete value.color;
    onChange && onChange(value);
  };
  const handleChange = (checked: boolean) => {
    onChange && onChange({ ...value, checked });
  };

  return (
    <div className="icon-switch-wrapper">
      {value && value.checked && (
        <Children
          icon={value.icon}
          color={value.color}
          disabled={disabled}
          onClose={handleIconChange}
          onChange={handleColorChange}
        />
      )}
      <LazySwitch
        disabled={disabled}
        value={value.checked}
        onChange={handleChange}
      />
    </div>
  );
}
