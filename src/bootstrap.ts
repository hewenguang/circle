import { builtIn } from '@/plugin';
import App from '@/core/app.class';
import getPlugins from '@cache/plugin';

export default function (app: App, callback: (error: any, data?: any) => void) {
  const plugins = getPlugins(app);

  // 插件注册
  window.definePlugin = function (
    name: string,
    deps?: string[],
    factory?: () => void
  ) {
    app.define(name, deps, factory);
  };

  app
    .option('plugin')
    .then((data) => {
      const items = builtIn.concat(data);
      callback &&
        callback(
          null,
          Object.keys(plugins).map((key: string) => ({
            ...plugins[key],
            name: key,
            enable: items.includes(key),
          }))
        );
    })
    .catch(callback);
}
