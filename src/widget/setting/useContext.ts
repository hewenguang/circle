import { merge } from './utils';
import each from '@/utils/each';
import useApp from '@/hooks/useApp';
import { IPanelProps } from './panel';
import { isUndefined } from '@/core/is';
import getPluginOptions from '@cache/options';
import pluginManage from '@/utils/plugin-manage';
import scrollIntoView from '@/utils/scrollintoview';
import { useRef, useState, useEffect } from 'react';
import scrollIntoViewIfNeeded from '@/utils/scrollIntoViewIfNeeded';

export default function () {
  const timer = useRef<any>(null);
  const { app, root } = useApp(false);
  const options = getPluginOptions(app);
  const [current, setCurrent] = useState('');
  const [filter, setFilter] = useState<string>('');
  const [activeKey, setActiveKey] = useState('style');
  const [visited, setVisited] = useState<Array<string>>([]);
  const [list, setList] = useState<Array<any>>(app.list());
  const { data, activeKeys, activeTabs } = merge(
    app,
    list,
    options,
    filter,
    current,
    visited
  );

  useEffect(() => {
    return app.on('setting_activekey', (key: string, selector: string) => {
      if (app.data('drawer') === 'setting') {
        app.data('setting') === key && app.fire('drawer', 'setting');
      } else {
        app.fire('drawer', 'setting');
      }
      setActiveKey(key);
      selector &&
        setTimeout(function () {
          const target = root.querySelector(`.${selector}`);
          if (!target) {
            return;
          }
          target.classList.remove('twinkle');
          scrollIntoView(target);
          target.classList.add('twinkle');
          const focusable = target.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          // @ts-ignore
          focusable && focusable.focus();
        }, 1000);
    });
  }, []);

  useEffect(() => {
    return app.on(
      'plugin_switch',
      (id: string, checked: boolean, cb?: () => void) => {
        pluginManage.call(app, id, !checked).then(async () => {
          app.state(id, checked ? 'enable' : 'disable');
          setCurrent(checked ? id : '');
          setList([...app.list()]);

          // 非阅读模式不操作插件
          if (app.data('running')) {
            const plugin = app.get(id);
            const slience = plugin && isUndefined(plugin.apply);
            if (checked) {
              if (!app.used(id)) {
                await app.load(id, slience);
              } else {
                !slience && app.start(id);
              }
              cb && cb();
            } else {
              cb && cb();
              !slience && app.destory(id);
            }
          }

          const option = options[id];
          if (!option || checked) {
            return;
          }

          const actions: Promise<any>[] = [];
          if (option.keys && option.keys.data) {
            each(option.keys.data, (item: string, key: string) => {
              actions.push(
                app
                  .option({ table: 'keys', name: key, origin: true })
                  .then((keys: { checked: boolean }) => {
                    if (keys && keys.checked) {
                      return app
                        .option({
                          table: 'keys',
                          name: key,
                          value: {
                            ...keys,
                            checked: false,
                          },
                        })
                        .then(() => {
                          app.fire(
                            'keys_hot',
                            {
                              ...keys,
                              checked: false,
                            },
                            key
                          );
                        });
                    }
                  })
              );
            });
          }
          if (option.toolbar && option.toolbar.data) {
            each(
              option.toolbar.data,
              (item: { id: string; checked: boolean }) => {
                actions.push(
                  app
                    .option({ table: 'toolbar', name: item.id, origin: true })
                    .then((toolbar: { checked: boolean }) => {
                      if (toolbar && toolbar.checked) {
                        return app
                          .option({
                            table: 'toolbar',
                            name: item.id,
                            value: {
                              ...toolbar,
                              checked: false,
                            },
                          })
                          .then(() => {
                            setTimeout(function () {
                              app.fire('toolbar_state', item.id, 'hidden');
                            }, 0);
                          });
                      }
                    })
                );
              }
            );
          }
          if (option.menu && option.menu.data) {
            each(option.menu.data, (item: string, key: string) => {
              actions.push(
                app
                  .option({ table: 'menu', name: key, origin: true })
                  .then((menu: { checked: boolean }) => {
                    if (menu && menu.checked) {
                      return app
                        .option({
                          table: 'menu',
                          name: key,
                          value: {
                            ...menu,
                            checked: false,
                          },
                        })
                        .then(() => {
                          app.fire(
                            'menu_hot',
                            {
                              ...menu,
                              checked: false,
                            },
                            key
                          );
                        });
                    }
                  })
              );
            });
          }
          actions.length > 0 && Promise.all(actions);
        });
      }
    );
  }, []);

  useEffect(() => {
    // 延迟保证 dom ready
    setTimeout(() => {
      const activeElement = root.querySelector(
        [
          '.ant-tabs-content-holder',
          '.ant-tabs-tabpane-active',
          '.twinkle',
        ].join(' ')
      );
      activeElement && scrollIntoViewIfNeeded(activeElement);
    }, 600);
  }, [activeKey, filter]);

  useEffect(() => {
    if (!activeKey) {
      return;
    }
    const oldActiveKey = app.data('setting');
    if (oldActiveKey === activeKey) {
      return;
    }
    app.data('setting', activeKey);
    const activeTabsSize = activeTabs.length;
    if (activeTabsSize <= 0) {
      app.data('visited', 'destory');
      return;
    }
    let visitedCache = app.data('visited') || visited;
    if (visitedCache.includes(activeKey)) {
      return;
    }
    if (visitedCache.length > 20) {
      visitedCache = [];
    }
    visitedCache.push(activeKey);
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setVisited(visitedCache);
      app.data('visited', 'destory');
    }, 2000);
  }, [activeKey, visited, activeTabs]);

  useEffect(() => {
    setCurrent('');
    setVisited([]);
  }, [filter]);

  useEffect(() => {
    if (current) {
      return;
    }
    setVisited([]);
  }, [current]);

  return {
    app,
    data,
    activeKey:
      data.length <= 0
        ? ''
        : data.find((item: IPanelProps) => item.id === activeKey)
        ? activeKey
        : data[0].id,
    setActiveKey,
    activeKeys,
    activeTabs,
    filter,
    setFilter,
  };
}
