import { InputNumber } from 'antd';
import React, { useState } from 'react';
import { InputNumberProps } from 'antd/es/input-number';
import './index.less';

interface IProps extends InputNumberProps {
  unit?: string;
  disabled?: boolean;
}

export default function (props: IProps) {
  const { unit, disabled, ...resetProps } = props;
  const [visible, setVisible] = useState(true);

  return (
    <div
      className="inputnumber"
      onMouseEnter={() => {
        if (!unit || disabled) {
          return;
        }
        setVisible(false);
      }}
      onMouseLeave={() => {
        if (!unit || disabled) {
          return;
        }
        setVisible(true);
      }}
    >
      <InputNumber {...resetProps} disabled={disabled} />
      {unit && (
        <div
          className="inputnumber-unit"
          style={{ opacity: visible ? '1' : '0' }}
        >
          {unit}
        </div>
      )}
    </div>
  );
}
