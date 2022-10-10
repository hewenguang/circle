import React from 'react';
import cx from 'classnames';
import { builtIn } from '@/plugin';
import useApp from '@/hooks/useApp';
import { isString } from '@/core/is';
import { List } from 'antd';
import LazyButton from '../../components/lazybutton';

interface IProps {
  id: string;
  data?: Array<any>;
  activeKeys: Array<string>;
}

type Item = {
  beta?: boolean;
  title: string;
  id: string;
  enable: boolean;
  tooltip?: string;
  deps?: Array<string>;
  learn_more?: string;
};

export default function (props: IProps) {
  const { id, data = [], activeKeys = [] } = props;
  const app = useApp();
  const datasource = data.filter((item) => !builtIn.includes(item.id));
  const handleChange = (checked: boolean, item: Item) => {
    const name = item.id;
    if (!name) {
      return;
    }
    app.fire('plugin_switch', name, checked, () => {
      app.fire(
        'plugin_hot',
        {
          ...item,
          enable: checked,
        },
        name
      );
    });
  };

  return (
    <List
      className="plugin-list"
      dataSource={datasource}
      renderItem={(item: Item) => (
        <List.Item
          className={cx(item.id, {
            twinkle: activeKeys.includes(`${id}_${item.id}`),
          })}
          actions={[
            <LazyButton
              app={app}
              key="action"
              value={item.enable}
              onChange={(checked) => handleChange(checked, item)}
            />,
          ]}
        >
          <List.Item.Meta
            description={item.tooltip}
            title={
              <>
                <label>
                  {item.learn_more ? (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        isString(item.learn_more) &&
                        !item.learn_more.startsWith('http')
                          ? app.path(item.learn_more)
                          : item.learn_more
                      }
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </label>
                {item.beta && <span className="beta">beta</span>}
              </>
            }
          />
        </List.Item>
      )}
    />
  );
}
