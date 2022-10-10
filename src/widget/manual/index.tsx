import React from 'react';
import App from '@/core/app.class';
import classname from '@/utils/classname';
import create from '@/utils/create';
import Entry from './entry';
import noop from '@/utils/noop';
import PluginBase from '@/utils/plugin.class';

const name = 'manual';
const className = classname('manual');

class Plugin extends PluginBase {
  private style: HTMLLinkElement;

  constructor(app: App) {
    super(app);
    this.render(
      app,
      <Entry
        app={app}
        className={className}
        onClose={() => {
          this.container.hide();
        }}
      />,
      undefined,
      noop,
      { hookInside: false }
    );
    this.style = create('style', {
      textContent: `
        html .${className} {
          outline: 2px solid red !important;
        }
      `,
    });
    document.head.appendChild(this.style);
  }

  start(app: App) {
    super.start(app);
    this.style.disabled = false;
  }

  destory() {
    super.destory();
    this.style.disabled = true;
  }

  action(app: App) {
    // 先销毁
    app.data('running') && app.fire('render_destory');
    this.container.show();
  }
}

window.definePlugin(name, Plugin);
