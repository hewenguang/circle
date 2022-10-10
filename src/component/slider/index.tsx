import cx from 'classnames';
import { Slider } from 'antd';
import { isString } from '@/utils/is';
import React, { useState, useEffect } from 'react';
import Title from '@/component/title';
import InputNumber from '../inputnumber';
import './index.less';

export default function (props: any) {
  const {
    min = 0,
    max,
    tooltip,
    step = 1,
    unit,
    title,
    value,
    marks,
    disabled,
    defaultValue,
    onChange,
    onAuthorize,
  } = props;
  const siliderDefaultValue =
    isString(defaultValue) && defaultValue
      ? parseFloat(defaultValue)
      : defaultValue;
  const [sliderValue, setSliderValue] = useState(value || siliderDefaultValue);

  useEffect(() => {
    const changeValue = isString(value) && value ? parseFloat(value) : value;
    setSliderValue(
      changeValue || changeValue === 0 ? changeValue : siliderDefaultValue
    );
  }, [value]);

  return (
    <div
      className={cx('slider-inner', {
        label: !!title,
      })}
    >
      {title && <Title title={title} tooltip={tooltip} />}
      <Slider
        min={min}
        max={max}
        step={step}
        marks={marks}
        disabled={disabled}
        value={sliderValue}
        tooltip={{
          open: false,
        }}
        onChange={(val) => {
          if (onAuthorize) {
            onAuthorize() && setSliderValue(val);
          } else {
            setSliderValue(val);
          }
        }}
        onAfterChange={(val) => {
          onChange && onChange(unit ? `${val}${unit}` : val);
        }}
      />
      <InputNumber
        min={0}
        max={max}
        unit={unit}
        step={step}
        size="small"
        value={sliderValue}
        disabled={disabled}
        onStep={(val: string | number) => {
          onChange && onChange(unit ? `${val}${unit}` : val);
        }}
        onInput={(val: string | number) => {
          onChange && onChange(unit ? `${val}${unit}` : val);
        }}
      />
    </div>
  );
}
