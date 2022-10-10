import React from 'react';
import entry from '@/utils/entry';
import App from '@/core/app.class';
import each from '@/utils/each';
import maxZindex from '@/utils/zindex';
import { Button, notification } from 'antd';
import { ArgsProps } from 'antd/lib/notification';
import { isString, isUndefined } from '@/utils/is';
import './index.less';

type Placement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight';

interface IProps extends ArgsProps {
  btnText?: string;
}

class Plugin {
  private placement: Placement;
  private container: HTMLElement;

  constructor(app: App) {
    this.placement = 'top';
    this.container = entry.call(app, { hookInside: false });
  }

  onNotice(app: App, options: any, callback: () => void) {
    if (isUndefined(options)) {
      return;
    }
    const opts: ArgsProps = isString(options)
      ? {
          type: 'success',
          message: options,
        }
      : options;
    const type = opts.type || 'open';
    const key = opts.key || `_${Date.now()}`;
    const args: IProps = {
      key,
      placement: this.placement,
      getContainer: () => this.container,
      ...opts,
    };
    if (callback) {
      const hanldeClose = () => {
        notification.close(key);
        callback && callback();
      };
      args.btn = (
        <Button size="small" type="primary" onClick={hanldeClose}>
          {args.btnText || app.i10n('ok')}
        </Button>
      );
    }
    notification[type](args);
    // 保证 dom 挂载成功
    setTimeout(() => {
      each(this.container.querySelectorAll('.ant-notification'), (notice) => {
        if (!notice.style.zIndex) {
          notice.style.setProperty('z-index', maxZindex() + 100);
        }
      });
    }, 0);
  }
}

window.definePlugin('notice', Plugin);
