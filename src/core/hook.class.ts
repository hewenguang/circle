// import { log } from '@/log';
import { isFunction, isString, isUndefined } from './is';

type Queue = {
  once: boolean;
  priority: number;
  factory: string;
};

export default class Hook {
  private _hook_map;
  private _hook_cache;

  constructor() {
    this._hook_map = {};
    this._hook_cache = {};
  }

  private _addFilter(
    name: string,
    callback: string | any,
    once?: boolean,
    priority: number = 10
  ) {
    !Array.isArray(this._hook_map[name]) && (this._hook_map[name] = []);
    const insertIndex = this._hook_map[name].findIndex(
      (item: Queue) => item.priority <= priority
    );
    const factory = isString(callback)
      ? () => this.fire(callback as string)
      : callback;
    this._hook_map[name].splice(insertIndex + 1, 0, {
      factory,
      priority,
      once: !!once,
    });
    if (Array.isArray(this._hook_cache[name])) {
      this._hook_cache[name].forEach((args: any) => {
        args.unshift(name);
        this.applyFilter.apply(this, args);
      });
      delete this._hook_cache[name];
    }
    return () => {
      this._remove(name, factory);
    };
  }

  private _remove(name: string, callback?: any) {
    if (!this.has(name)) {
      return;
    }
    if (isFunction(callback)) {
      const removeIndex = this._hook_map[name].findIndex(
        (item: Queue) => item.factory === callback
      );
      removeIndex >= 0 && this._hook_map[name].splice(removeIndex, 1);
    } else {
      delete this._hook_map[name];
    }
  }

  remove(name: string | string[], callback?: () => void) {
    // log('remove --->', name);
    if (Array.isArray(name)) {
      name.forEach((item) => {
        this._remove(item);
      });
      return;
    }
    this._remove(name, callback);
  }

  has(name: string) {
    return !!this._hook_map[name];
  }

  addFilter(
    name: string | string[],
    callback: string | any,
    once?: boolean,
    priority?: number
  ) {
    // name.indexOf('-') > 0 && log('listen filter error', name);
    if (Array.isArray(name)) {
      const destorys: Array<() => void> = [];
      name.forEach((item) => {
        destorys.push(this._addFilter(item, callback, once, priority));
      });
      return () => {
        destorys.forEach((destory) => {
          destory();
        });
      };
    }
    return this._addFilter(name, callback, once, priority);
  }

  applyFilter(name: string, ...args: any[]) {
    // name.indexOf('-') > 0 && log('fire filter error', name);
    if (!this.has(name)) {
      !Array.isArray(this._hook_cache[name]) && (this._hook_cache[name] = []);
      this._hook_cache[name].push(args);
      return args[0];
    }
    const hooksToRemove: Array<() => void> = [];
    this._hook_map[name] &&
      this._hook_map[name].forEach((item: Queue) => {
        const factory = item.factory as any;
        const returnValue = isFunction(factory)
          ? factory.apply(this, args)
          : factory;
        !isUndefined(returnValue) && (args[0] = returnValue);
        item.once && hooksToRemove.push(factory);
      });
    hooksToRemove.forEach((factory: () => void) => {
      this.remove(name, factory);
    });
    return args[0];
  }

  on(name: string, callback: string | any, once?: boolean, priority?: number) {
    // name.indexOf('-') > 0 && log('listen hook error', name);
    return this.addFilter(name, callback, once, priority);
  }

  fire(name: string, ...args: any) {
    // name.indexOf('-') > 0 && log('fire hook error', name);
    args.unshift(name);
    this.applyFilter.apply(this, args);
  }
}
