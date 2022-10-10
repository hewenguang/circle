import each from '@/utils/each';
import sort from '@/utils/sort';
import App from '@/core/app.class';
import { IPanelProps } from './panel';
import { isString, isPlainObject } from '@/utils/is';

export function merge(
  app: App,
  data: Array<IPanelProps>,
  options: any,
  filter: string,
  current: string,
  visited: Array<string>
): any {
  const items = {};
  const plugins: Array<any> = [];
  each(data, (item: any) => {
    const plugin: any = {
      id: item.name,
      title: item.title,
      enable: item.enable,
    };
    item.deps && (plugin.deps = item.deps);
    item.beta && (plugin.beta = item.beta);
    item.desc && (plugin.tooltip = item.desc);
    item.link && (plugin.learn_more = item.link);
    item.priority && (plugin.priority = item.priority);
    plugins.push(plugin);
  });
  const activeKeys: string[] = [];
  const activeTabs: string[] = [];
  each(options, (item: any, name: string) => {
    const plugin = plugins.find((plugin) => plugin.id === name);
    if (!plugin || !plugin.enable) {
      return;
    }
    const active = current === name;
    each(item, (value: any, id: string) => {
      const originData = value.data || [];
      const itemData = isPlainObject(originData)
        ? Object.keys(originData).map((key: string) => ({
            id: key,
            ...originData[key],
          }))
        : originData;
      if (items[id]) {
        const itemPriority = value.priority || 0;
        const origin = items[id].data || [];
        const originPriority = items[id].priority || 0;
        if (!items[id].title && value.title) {
          items[id] = { ...value, id };
        }
        items[id].data =
          itemPriority <= originPriority
            ? [...origin, ...itemData]
            : [...itemData, ...origin];
      } else {
        items[id] = { ...value, id, ...{ data: itemData } };
      }
      if (active && !visited.includes(id)) {
        !activeTabs.includes(id) && activeTabs.push(id);
        each(itemData, (option) => {
          !visited.includes(id) && activeKeys.push(`${id}_${option.id}`);
        });
      }
    });
  });
  const dataFilter = Object.values(items).filter((item: any) => !!item.title);
  dataFilter.push({
    type: 'plugin',
    data: plugins,
    priority: 110,
    id: 'plugin',
    icon: 'AppstoreOutlined',
    title: app.i10n('plugin'),
  });
  const source = sort(dataFilter);
  const results =
    filter.length <= 0
      ? source
      : source.filter((item: any) => {
          if (isString(item.title) && item.title.indexOf(filter) >= 0) {
            activeKeys.push(item.id);
            return true;
          }
          if (Array.isArray(item.data)) {
            let exist = false;
            each(item.data, (value: { title: string; id: string }) => {
              if (isString(value.title) && value.title.indexOf(filter) >= 0) {
                activeKeys.push(`${item.id}_${value.id}`);
                exist = true;
                return true;
              }
              return;
            });
            if (exist) {
              return true;
            }
          }
          return false;
        });
  return { data: results, activeKeys, activeTabs };
}
