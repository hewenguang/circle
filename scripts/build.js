const path = require('path');
const glob = require('glob');
const { readFileSync, writeFileSync } = require('fs');

const wrapper = (data) => {
  return `import App from '../src/core/app.class';

export default function(app: App){
  return ${JSON.stringify(data).replace(/"__MSG_(.*?)__"/g, "app.i10n('$1')")};
}
`;
};

const data = {};
const plugins = {};
const pluginOptions = {};
glob.sync('src/widget/*/manifest.json').forEach((item) => {
  const name = item.split('/')[2];
  const file = readFileSync(path.resolve(__dirname, `../${item}`));
  const manifest = JSON.parse(file);
  const props = {
    title: manifest.title,
  };
  manifest.description && (props.desc = manifest.description);
  manifest.priority && (props.priority = manifest.priority);
  manifest.apply && (props.apply = manifest.apply);
  manifest.type && (props.type = manifest.type);
  manifest.beta && (props.beta = manifest.beta);
  manifest.dependencies && (props.deps = manifest.dependencies);
  manifest.homepage_url && (props.link = manifest.homepage_url);
  plugins[name] = props;
  if (manifest.options) {
    Object.keys(manifest.options).forEach((key) => {
      const item = manifest.options[key];
      !pluginOptions[name] && (pluginOptions[name] = {});
      if (item && item.data) {
        let nextData;
        if (Array.isArray(item.data)) {
          nextData = item.data.map((option) => {
            if (!manifest.priority || typeof option.priority !== 'undefined') {
              return option;
            }
            return {
              ...option,
              priority: manifest.priority,
            };
          });
        } else {
          nextData = {};
          Object.keys(item.data).map((key) => {
            const dataItem = item.data[key];
            if (
              !manifest.priority ||
              typeof dataItem.priority !== 'undefined'
            ) {
              nextData[key] = dataItem;
              return;
            }
            nextData[key] = {
              ...dataItem,
              priority:
                typeof dataItem.priority !== 'undefined'
                  ? dataItem.priority
                  : manifest.priority,
            };
          });
        }
        pluginOptions[name][key] = {
          ...item,
          data: nextData,
        };
      } else {
        if (typeof item.priority !== 'undefined') {
          pluginOptions[name][key] = item;
        } else {
          pluginOptions[name][key] =
            typeof manifest.priority !== 'undefined'
              ? { ...item, priority: manifest.priority }
              : item;
        }
      }
    });
  }
  if (manifest.data) {
    Object.keys(manifest.data).forEach((key) => {
      const option = manifest.data[key];
      if (['setting'].includes(key)) {
        Object.keys(option).forEach((optionKey) => {
          const item = manifest.data.setting[optionKey];
          !data.setting && (data.setting = {});
          if (Array.isArray(item)) {
            !data.setting[optionKey] && (data.setting[optionKey] = []);
            data.setting[optionKey] = [...data.setting[optionKey], ...item];
          } else {
            !data.setting[optionKey] && (data.setting[optionKey] = {});
            data.setting[optionKey] = {
              ...data.setting[optionKey],
              ...item,
            };
          }
        });
        return;
      }
      if (Array.isArray(option)) {
        !data[key] && (data[key] = []);
        const nextOption = option.map((item) => {
          if (!manifest.priority || typeof item.priority !== 'undefined') {
            return item;
          }
          return {
            ...item,
            priority: manifest.priority,
          };
        });
        data[key] = [...data[key], ...nextOption];
      } else {
        !data[key] && (data[key] = {});
        const nextOption = {};
        Object.keys(option).map((key) => {
          const dataItem = option[key];
          if (!manifest.priority || typeof dataItem.priority !== 'undefined') {
            nextOption[key] = dataItem;
            return;
          }
          nextOption[key] = {
            ...dataItem,
            priority:
              typeof dataItem.priority !== 'undefined'
                ? dataItem.priority
                : manifest.priority,
          };
        });
        data[key] = {
          ...data[key],
          ...nextOption,
        };
      }
    });
  }
});

writeFileSync(path.join(__dirname, '../.cache/data.ts'), wrapper(data));
writeFileSync(path.join(__dirname, '../.cache/plugin.ts'), wrapper(plugins));
writeFileSync(
  path.join(__dirname, '../.cache/options.ts'),
  wrapper(pluginOptions)
);

const i10n = {};
glob.sync('src/widget/*/i10n/*.json').forEach((item) => {
  const name = item.split('/').pop().replace('.json', '');
  const file = readFileSync(path.resolve(__dirname, `../${item}`));
  const manifest = JSON.parse(file);
  !i10n[name] && (i10n[name] = {});
  i10n[name] = {
    ...i10n[name],
    ...manifest,
  };
});

writeFileSync(
  path.join(__dirname, '../.cache/i10n.ts'),
  `export default ${JSON.stringify(i10n)};`
);
