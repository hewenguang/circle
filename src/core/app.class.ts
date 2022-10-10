// import log from '@/utils/log';
// import { debug } from '@/config';
import Base from './base.class';
import { IPluginOption } from './plugin.class';
import { query, option, Option } from './utils';
import { isBoolean, isUndefined, isFunction } from './is';

export default class App extends Base {
  private timer: any;

  constructor(options?: IPluginOption) {
    super(options);
    this.initEvent();
  }

  private initEvent() {
    window.addEventListener('scroll', () => {
      if (!this.data('running')) {
        return;
      }
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.fire('scroll', window.pageYOffset);
      }, 200);
    });
    window.addEventListener('resize', () => {
      if (!this.data('running')) {
        return;
      }
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.fire('resize', window.innerHeight);
      }, 200);
    });
    document.addEventListener('keydown', (event) => {
      this.fire('keydown', event);
    });
  }

  send(
    type: string,
    option?: any,
    callback?: (error?: string, data?: any) => void
  ) {
    const valid = isFunction(option);
    const opts = valid ? {} : option;
    const cb = valid ? option : callback;

    this.runtime.sendMessage(
      this.runtime.id,
      {
        ...opts,
        type,
      },
      (...args: any) => {
        if (!isFunction(cb)) {
          return;
        }
        const arg = args[0];
        cb.apply(
          null,
          !arg || isUndefined(arg.error) ? args : [arg.error, arg.data]
        );
        this.runtime.lastError && console.log(this.runtime.lastError);
      }
    );
  }

  async doAction(name: string) {
    const abort = this.applyFilter(`${name}_abort`);
    if (isBoolean(abort) && abort) {
      return;
    }
    this.data('mobile') && (await this.apply(`mobile_${name}`));
    await this.apply(name);
    [`${name}_before`, name, `${name}_after`].forEach((hook) => {
      this.fire(hook);
    });
  }

  fire(hook: string, ...args: any) {
    const [name, module] = hook.split('__');
    args.unshift(module ? hook.replace(/__/g, '_') : name);
    // console.log(hook, name, module, args);
    const plugin = this.get(name);
    if (plugin) {
      if (this.used(name)) {
        if (plugin && plugin.type === 'ui') {
          if (this.running(name)) {
            this.destory(name);
          } else {
            this.start(name);
          }
        } else {
          super.fire.apply(this, args);
        }
      } else {
        this.load(name).then(() => {
          if (module || (plugin.deps && plugin.deps.includes('react'))) {
            setTimeout(() => {
              super.fire.apply(this, args);
            }, 100);
          } else {
            super.fire.apply(this, args);
          }
        });
      }
    } else {
      super.fire.apply(this, args);
    }
  }

  option(data: string | Option) {
    return option(data, this, true);
  }

  query(url: string, options?: any) {
    return query(url, options, this, true);
  }

  guide(name: string, module: string, selector?: string) {
    !this.used(name) && this.fire(name);
    setTimeout(() => {
      this.fire(`${name}_activekey`, module, selector);
    }, 1000);
  }
}
