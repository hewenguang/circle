import React from 'react';
import { Button } from 'antd';
import App from '@/core/app.class';

interface IProps {
  app: App;
  value: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export default function (props: IProps) {
  const { app, value, disabled, onChange } = props;
  // const [checked, setChecked] = useState(value);
  const handleChange = () => {
    onChange(!value);
    // const nextValue = !checked;
    // setChecked(nextValue);
    // setTimeout(() => {
    //   onChange(nextValue);
    // }, 1000);
  };

  // useEffect(() => {
  //   setChecked(value);
  // }, [value]);

  return (
    <Button
      danger={value}
      disabled={disabled}
      onClick={handleChange}
      type={value ? 'default' : 'primary'}
    >
      {app.i10n(value ? 'disable' : 'enable')}
    </Button>
  );
}
