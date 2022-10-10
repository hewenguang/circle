import React, { useEffect } from 'react';
import useApp from '@/hooks/useApp';
import Icon from '@ant-design/icons';
import { Space, Switch } from 'antd';
import Title from '@/component/title';
import './index.less';

interface IProps {
  id: string;
  value: boolean;
  nightValue: boolean;
  onChange: (checked: boolean) => void;
  nightChange: (checked: boolean) => void;
}

export default function (props: IProps) {
  const { id, value, onChange, nightValue, nightChange } = props;
  const app = useApp();

  useEffect(() => {
    app.fire('render_theme', id, value ? 'dark' : 'light');
  }, [value]);

  useEffect(() => {
    app.fire('render_theme', id, nightValue ? (value ? 'dark' : 'light') : id);
  }, [nightValue]);

  return (
    <div className="ant-list-item night">
      <Space>
        <Title
          placement="bottomLeft"
          title={app.i10n('night')}
          labelTooltip={app.i10n(`${id}_night_tooltip`)}
        />
        <Switch checked={nightValue} onChange={nightChange} />
      </Space>
      <Switch
        disabled={!nightValue}
        checked={value}
        onChange={onChange}
        unCheckedChildren={
          <Icon
            component={() => (
              <svg
                viewBox="0 0 1024 1024"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M478.634667 811.349333a304.490667 304.490667 0 0 0 64.021333 0.277334v124.330666h-64v-124.608z m267.776-110.229333l87.594666 87.637333-45.226666 45.248-87.658667-87.594666c16.64-13.44 31.829333-28.629333 45.290667-45.290667z m-469.994667-1.493333c13.333333 16.746667 28.416 32 44.970667 45.568L232.533333 834.005333l-45.248-45.226666 89.130667-89.130667zM512 261.034667c138.602667 0 250.986667 112.384 250.986667 250.986666 0 138.602667-112.384 250.986667-250.986667 250.986667-138.602667 0-250.986667-112.384-250.986667-250.986667 0-138.602667 112.384-250.986667 250.986667-250.986666z m0 64a186.986667 186.986667 0 1 0 0 373.973333 186.986667 186.986667 0 0 0 0-373.973333z m423.957333 153.642666v64h-124.330666a304.725333 304.725333 0 0 0-0.277334-64h124.608z m-723.306666 0a304.490667 304.490667 0 0 0-0.277334 64H85.333333v-64h127.317334zM232.533333 187.264l90.346667 90.304c-16.64 13.44-31.829333 28.629333-45.290667 45.290667L187.306667 232.533333l45.226666-45.248z m556.224 0l45.248 45.226667-88.810666 88.874666a302.997333 302.997333 0 0 0-45.546667-44.970666l89.109333-89.130667zM542.656 85.333333v127.04a304.725333 304.725333 0 0 0-64 0.277334V85.333333h64z" />
              </svg>
            )}
          />
        }
        checkedChildren={
          <Icon
            component={() => (
              <svg
                viewBox="0 0 1024 1024"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M512 170.666667c15.530667 0 30.805333 1.045333 45.781333 3.050666a206.72 206.72 0 0 0-70.165333 155.434667c0 114.453333 92.8 207.232 207.232 207.232a206.72 206.72 0 0 0 155.434667-70.165333c2.005333 14.976 3.050667 30.250667 3.050666 45.781333 0 188.522667-152.810667 341.333333-341.333333 341.333333S170.666667 700.522667 170.666667 512 323.477333 170.666667 512 170.666667z m-75.029333 74.261333l-6.229334 1.834667C317.226667 281.493333 234.666667 387.114667 234.666667 512c0 153.173333 124.16 277.333333 277.333333 277.333333 127.146667 0 234.346667-85.589333 267.072-202.304-26.773333 8.746667-55.125333 13.354667-84.224 13.354667-149.781333 0-271.232-121.450667-271.232-271.232 0-25.856 3.648-51.136 10.581333-75.242667l2.773334-8.96zM751.232 170.666667v77.696h77.717333v64h-77.717333v77.738666h-64v-77.738666h-77.717333v-64h77.717333V170.666667h64z" />
              </svg>
            )}
          />
        }
      />
    </div>
  );
}
