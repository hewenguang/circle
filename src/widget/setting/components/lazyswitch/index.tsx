import React from 'react';
import useApp from '@/hooks/useApp';
import { Switch, Tooltip } from 'antd';

interface IProps {
  value?: boolean;
  disabled?: boolean;
  depPlugin?: string;
  onChange: (checked: boolean) => void;
}

export default function (props: IProps) {
  const { depPlugin, value, disabled, onChange } = props;
  const app = useApp();
  // const [checked, setChecked] = useState(value);
  const handleChange = (checked: boolean) => {
    onChange(checked);
    // const nextValue = !checked;
    // setChecked(nextValue);
    // setTimeout(() => {
    //   onChange(nextValue);
    // }, 1000);
  };
  const plugins = app.list();
  let depPluginTitle = '';
  if (depPlugin) {
    const plugin = plugins.find((plugin: any) => plugin.name === depPlugin);
    if (plugin && !plugin.enable) {
      depPluginTitle = plugin.title;
    }
  }

  // useEffect(() => {
  //   setChecked(value);
  // }, [value]);

  return (
    <Tooltip
      placement="left"
      title={
        depPluginTitle ? app.i10n('need_enable_plugin', depPluginTitle) : null
      }
    >
      <Switch
        checked={value}
        onChange={handleChange}
        disabled={!!depPluginTitle || disabled}
      />
    </Tooltip>
  );
}
