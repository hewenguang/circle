import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import wait from '@/utils/wait';
import './index.less';

interface IProps {
  value?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export default function (props: IProps) {
  const { value, className, disabled, onChange } = props;
  const [color, setColor] = useState(value);
  const handleChange = (event: any) => {
    const value = event.target.value;
    setColor(value);
    wait(function () {
      onChange && onChange(value);
    });
  };

  useEffect(() => {
    setColor(value);
  }, [value]);

  return (
    <input
      type="color"
      disabled={disabled}
      onChange={handleChange}
      className={cx('colorpicker', className, { disabled })}
      value={
        color && /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)
          ? color
          : '#000000'
      }
    />
  );
}
