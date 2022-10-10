import React from 'react';
import useApp from '@/hooks/useApp';
import getAttr from '@/utils/get-attr';
import { Card, Space, Button } from 'antd';
import { ButtonProps } from 'antd/es/button';

interface IProps {
  message: string;
  title: string;
  data: Array<{
    title: string;
    id: string;
    type?: ButtonProps['type'];
  }>;
}

const opera =
  'https://addons.opera.com/en/extensions/details/circle-yue-du-mo-shi';
const firefox =
  'https://addons.mozilla.org/zh-CN/firefox/addon/circle-reading-mode/';
const qihu360 =
  'https://ext.chrome.360.cn/webstore/detail/dhpfcgilccfkodnhbllpiaabofjbjcbg';
const chrome =
  'https://chrome.google.com/webstore/detail/circle-reader-mode/dhpfcgilccfkodnhbllpiaabofjbjcbg';
const edge =
  'https://microsoftedge.microsoft.com/addons/detail/circle-%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%EF%BD%9Creader-mode/hjkjecmcifblnghjpcjaofpakjpgfjio';

export default function (props: IProps) {
  const { title, message, data } = props;
  const app = useApp();
  const to = (url: string) => {
    app.send('tab', {
      action: 'create',
      value: { url },
    });
  };
  const handleVote = () => {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edg') > -1:
        to(edge);
        break;
      case agent.indexOf('opr') > -1 && !!window.opr:
        to(opera);
        break;
      case agent.indexOf('firefox') > -1:
        to(firefox);
        break;
      case agent.indexOf('qihu') > -1:
        to(qihu360);
        break;
      case agent.indexOf('chrome') > -1 && !!window.chrome:
        to(chrome);
        break;
      default:
        app.fire('notice', {
          type: 'warning',
          message: app.i10n('vote_alert'),
        });
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    const target: any = event.currentTarget;
    switch (getAttr(target, 'data-type')) {
      case 'feedback':
        to(app.path('feedback'));
        break;
      case 'vote':
        handleVote();
        break;
    }
  };

  return (
    <Card bordered={false} title={title}>
      {message && <p>{message}</p>}
      {data && (
        <Space wrap>
          {data.map((item) => {
            return (
              <Button
                type={item.type}
                key={item.title}
                onClick={handleClick}
                data-type={item.id}
              >
                {item.title}
              </Button>
            );
          })}
        </Space>
      )}
    </Card>
  );
}
