import log from '@/log';
import App from '@/core/app.class';
import action from '@/utils/action';
import { getHash } from '@/utils/hash';
import { isBoolean, isFunction } from '@/utils/is';
import parser from './parser';

class Plugin {
  filterParserHold(app: App, hold: boolean) {
    const { hash } = getHash('circle');
    if (hash.includes('circle=off')) {
      return true;
    }
    if (hash.includes('circle=on')) {
      return false;
    }
    return hold;
  }

  async onActionClicked(app: App, callback?: () => void) {
    callback && callback();
    const abort = app.applyFilter('action_clicked_abort');
    if (isBoolean(abort) && abort) {
      return;
    }
    if (app.used('render')) {
      app.fire('render');
    } else {
      await app.doAction('parser_ready');
    }
  }

  onEnterOrExit(app: App, callback: () => void) {
    callback && callback();
    const node = app.data('node');
    if (!node || !node.article) {
      app.fire('notice', {
        type: 'error',
        message: app.i10n('parser_error'),
      });
    } else {
      this.onActionClicked(app);
    }
  }

  onParserStart(
    app: App,
    context: Document = document,
    // 函数是为了 nextpage
    autoHold?: boolean | ((error?: string) => void)
  ) {
    const abort = app.applyFilter('parser_abort');
    if (isBoolean(abort) && abort) {
      // @ts-ignore
      isFunction(autoHold) && autoHold('abort');
      return Promise.reject();
    }
    return parser(context).then((node) => {
      app.fire('parser_after');
      // title 见 https://mp.weixin.qq.com/s/Q9YR9AAL6iFTNN0V6T_snQ
      // @ts-ignore
      if (!node || !node.article) {
        // @ts-ignore
        isFunction(autoHold) && autoHold('fail');
        return Promise.reject();
      }
      const data = app.applyFilter('parser_done', node);
      app.data('node', data);
      // @ts-ignore
      isFunction(autoHold) && autoHold();
      action.call(app, 'ready');
      return Promise.resolve(!!autoHold);
    });
  }

  start(app: App) {
    this.onParserStart(app, document, true)
      .then((autoHold?: any) => {
        app.doAction('parser_success');
        const hold = app.applyFilter('parser_hold', autoHold);
        if (isBoolean(hold) && hold) {
          return Promise.reject();
        }
        return app.doAction('parser_ready');
      })
      .catch((err: string) => {
        log(err);
        // app.doAction('parser_failure');
      });
  }
}

window.definePlugin('parser', Plugin);
