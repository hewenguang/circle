import React from 'react';
import { ConfigProvider } from 'antd';
import Main from './main';
import useContext from './useContext';

export default function (props: any) {
  const { app, root } = props;
  const data = useContext(app);

  // 1 是考虑只有一个标题的情况
  if (data.length <= 1) {
    return null;
  }

  return (
    <ConfigProvider
      getPopupContainer={(trigger?: HTMLElement | undefined) =>
        trigger ? trigger.parentElement : root
      }
    >
      <Main app={app} data={data} />
    </ConfigProvider>
  );
}
