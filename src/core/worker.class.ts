import Base from './base.class';
import { query, option, Option } from './utils';

export default class Worker extends Base {
  private handleError(tab: any) {
    if (
      this.runtime.lastError &&
      this.runtime.lastError.message.indexOf('Receiving end does not exist') >=
        0 &&
      tab.url
    ) {
      this.tabs.update(
        tab.id,
        {
          url: `${tab.url}${tab.url.indexOf('#') < 0 ? '#' : '/'}circle=on`,
        },
        () => {
          this.tabs.reload(tab.id);
        }
      );
    }
  }

  send(type: string, option?: any, callback?: (args: any) => void) {
    if (option.tab && option.tab.id) {
      this.tabs.sendMessage(
        option.tab.id,
        Object.assign(option, { type }),
        (...args: any) => {
          callback && callback.apply(null, args);
          this.runtime.lastError && this.handleError(option.tab);
        }
      );
    } else {
      this.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
        if (this.runtime.lastError) {
          console.log(this.runtime.lastError);
          return;
        }
        if (Array.isArray(tabs) && tabs.length > 0 && tabs[0].id) {
          this.tabs.sendMessage(
            tabs[0].id,
            Object.assign(option, { type }),
            (...args: any) => {
              callback && callback.apply(null, args);
              this.runtime.lastError && this.handleError(tabs[0]);
            }
          );
        }
      });
    }
  }

  option(data: string | Option) {
    return option(data, this);
  }

  query(url: string, options: any) {
    return query(url, options, this);
  }
}
