import { Tabs, Empty } from 'antd';
import React, { useRef } from 'react';
import { isString } from '@/utils/is';
import Label from './label';
import Search from './search';
import useContext from './useContext';
import Alert from './components/alert';
import Panel, { IPanelProps } from './panel';

interface IProps {
  size?: 'small' | 'middle' | 'large';
  placement: 'left' | 'right' | 'top' | 'bottom';
}

export default function (props: IProps) {
  const { size, placement } = props;
  const root = useRef<any>(null);
  const {
    app,
    data,
    activeKey,
    activeTabs,
    setActiveKey,
    activeKeys,
    filter,
    setFilter,
  } = useContext();

  return (
    <div ref={root} style={{ height: '100%', width: '100%' }}>
      <Search app={app} onChange={setFilter} defaultValue={filter} />
      {data.length > 0 ? (
        <Tabs
          centered
          size={size}
          className="tabs"
          activeKey={activeKey}
          onChange={setActiveKey}
          tabPosition={placement}
          items={data.map((item: IPanelProps) => {
            return {
              key: item.id,
              label: (
                <Label
                  {...item}
                  root={root.current}
                  active={activeTabs.includes(item.id)}
                />
              ),
              children: (
                <>
                  {item.tooltip && (
                    <Alert
                      id={item.id}
                      message={
                        <>
                          {item.tooltip}
                          {item.learn_more && (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              style={{ marginLeft: 3 }}
                              href={
                                isString(item.learn_more) &&
                                !item.learn_more.startsWith('http')
                                  ? app.path(item.learn_more)
                                  : item.learn_more
                              }
                            >
                              {app.i10n('learn_more')}
                            </a>
                          )}
                        </>
                      }
                      title={app.i10n('sure_to_close')}
                    />
                  )}
                  <Panel {...item} activeKeys={activeKeys} />
                </>
              ),
            };
          })}
        />
      ) : (
        <div className="empty">
          <Empty
            description={app.i10n('filter_nothing')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </div>
  );
}
