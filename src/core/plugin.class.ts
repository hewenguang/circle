import { log } from '@/log';
import Hook from './hook.class';
import { isFunction, isAsyncFunction } from './is';

export interface IPlugin {
  title?: string;
  data?: any;
  name: string;
  used?: boolean;
  type?: string;
  enable?: boolean;
  deps?: string[];
  apply?: string;
  factory?: any;
  priority?: number;
}

export interface IPluginOption {
  loader?: (name: string | string[]) => Promise<any>;
}

const defaultOptions: IPluginOption = {
  loader: function (name: string | string[]) {
    return new Promise((resolve) => {
      this.send(
        'scripting',
        {
          action: 'executeScript',
          value: {
            files: (Array.isArray(name) ? name : [name]).map(
              (item) => `widget/${item}.js`
            ),
          },
        },
        resolve
      );
    });
  },
};

export default class Plugin extends Hook {
  private _plugin_meta: IPlugin[];
  private _plugin_option: IPluginOption;
  private _plugin_map: { [index: string]: any };
  private _plugin_hooks: { [index: string]: Array<() => void> } = {};

  constructor(options?: IPluginOption) {
    super();
    this._plugin_map = {};
    this._plugin_meta = [];
    this._plugin_option = Object.assign(defaultOptions, options);
  }

  get(name: string): undefined | IPlugin {
    return this._plugin_meta.find((item) => item.name === name);
  }

  state(name: string, state: 'enable' | 'disable') {
    const index = this._plugin_meta.findIndex((item) => item.name === name);
    if (index < 0) {
      return;
    }
    const plugin = this._plugin_meta[index];
    this._plugin_meta.splice(index, 1, {
      ...plugin,
      enable: state === 'enable',
    });
  }

  list() {
    return this._plugin_meta;
  }

  async apply(name: string) {
    const plugins = this._plugin_meta.filter((item: IPlugin) => {
      // 未启用或者已加载
      if (!item.enable || !!this._plugin_map[item.name]) {
        return false;
      }
      if (Array.isArray(item.apply)) {
        return item.apply.includes(name);
      }
      return item.apply === name;
    });
    if (plugins.length <= 0) {
      return;
    }
    await this.load(plugins.map((plugin) => plugin.name));
  }

  init(plugin: IPlugin | IPlugin[], callback?: () => void) {
    this._plugin_meta = [];
    (Array.isArray(plugin) ? plugin : [plugin])
      .sort(
        (prev: IPlugin, next: IPlugin) =>
          (prev.priority || 0) - (next.priority || 0)
      )
      .forEach((item) => {
        const plugin = this.get(item.name);
        !plugin && this._plugin_meta.push(item);
      });
    callback && callback();
  }

  define(name: string, deps?: string[] | (() => void), factory?: () => void) {
    log('define -->', name);
    const index = this._plugin_meta.findIndex((item) => item.name === name);
    if (index < 0) {
      return;
    }
    const hasDeps = Array.isArray(deps);
    const depsValue = hasDeps ? deps : [];
    const factoryValue = hasDeps ? factory : deps;
    const plugin: IPlugin = {
      ...this._plugin_meta[index],
      deps: depsValue,
      factory: factoryValue,
    };
    this._plugin_meta.splice(index, 1, plugin);
  }

  running(name: string) {
    const instance = this.getInstance(name);
    if (!instance) {
      return false;
    }
    return instance._running;
  }

  used(name: string): boolean {
    return !!this._plugin_map[name];
  }

  getInstance(name: string) {
    if (this._plugin_map[name]) {
      return this._plugin_map[name];
    }
    const plugin = this.get(name);
    if (!plugin || !plugin.factory) {
      return;
    } else {
      const factory = plugin.factory;
      if (factory.toString().slice(0, 5) == 'class') {
        this._plugin_map[name] = new factory(this);
        this._plugin_map[name]._methods = Object.getOwnPropertyNames(
          factory.prototype
        );
      } else {
        this._plugin_map[name] = factory.call(this) || {};
        this._plugin_map[name]._methods = Object.keys(this._plugin_map[name]);
      }
    }
    return this._plugin_map[name];
  }

  async destory(name: string) {
    const instance = this.getInstance(name);
    if (!instance) {
      return;
    }
    log('destory -->', name, instance);
    if (isFunction(instance.destory)) {
      instance.destory(this);
    } else if (isAsyncFunction(instance.destory)) {
      await instance.destory(this);
    }
    instance._running = false;
    const returnHooks = this._plugin_hooks[name];
    if (!Array.isArray(returnHooks)) {
      return;
    }
    returnHooks.forEach((returnHook: () => void) => {
      returnHook();
    });
    delete this._plugin_hooks[name];
  }

  async start(name: string | string[]) {
    const items = Array.isArray(name) ? name : [name];
    for (const item of items) {
      const instance = this.getInstance(item);
      if (instance) {
        const methods: Array<string> = instance._methods;
        const actions = methods.filter(
          (method: string) =>
            method.startsWith('on') ||
            method.startsWith('filter') ||
            method === 'action'
        );
        actions.forEach((action: string) => {
          const method =
            action === 'action'
              ? `on${item.replace(/^\S/, (value) => value.toUpperCase())}`
              : action;
          const listen = method.startsWith('on');
          const hook = method
            .substring(listen ? 2 : 6)
            .replace(/^\S/, (value) => value.toLowerCase())
            .replace(/[A-Z]/g, (value) => `_${value.toLowerCase()}`);
          if (hook.length > 0) {
            !Array.isArray(this._plugin_hooks[item]) &&
              (this._plugin_hooks[item] = []);
            const cancel = this[listen ? 'on' : 'addFilter'](
              hook,
              (...args: any) => {
                args.unshift(this);
                return instance[action].apply(instance, args);
              }
            );
            this._plugin_hooks[item].push(cancel);
          }
        });
        if (isAsyncFunction(instance.start)) {
          await instance.start(this);
        } else if (isFunction(instance.start)) {
          instance.start(this);
        }
        instance._running = true;
      }
    }
  }

  async load(name: string | string[], slience?: boolean) {
    const items: string[] = [];
    (Array.isArray(name) ? name : [name]).forEach((item) => {
      const plugin = this.get(item);
      if (
        plugin &&
        (plugin.enable ||
          // 兼容 paper
          (plugin.type && plugin.type === 'ui' && plugin.apply)) &&
        !this.used(item)
      ) {
        if (plugin.deps && plugin.deps.length > 0) {
          plugin.deps.forEach((dep) => {
            const depsPlugin = this.get(dep);
            if (
              depsPlugin &&
              depsPlugin.enable &&
              !this.used(dep) &&
              !items.includes(dep)
            ) {
              items.unshift(dep);
            }
          });
        }
        !items.includes(item) && items.push(item);
      }
    });
    if (items.length > 0) {
      this._plugin_option.loader &&
        (await this._plugin_option.loader.call(this, items));
      !slience && (await this.start(items));
    }
  }
}
