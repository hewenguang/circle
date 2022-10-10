import ready from '@/utils/ready';
import App from '@/core/app.class';
import action from '@/utils/action';
import create from '@/utils/create';
import i18nOption from '@/utils/i18n-option';
import bootstrap from './bootstrap';

const app = new App({
  loader: function (name: string | string[]) {
    return new Promise((resolve) => {
      const items = Array.isArray(name) ? name : [name];
      let index = 0;
      const size = items.length;
      items.forEach((item) => {
        const script = create('script', {
          type: 'text/javascript',
          src: this.runtime.getURL(`widget/${item}.js`),
        });
        script.addEventListener('load', () => {
          document.documentElement.removeChild(script);
          index++;
          index >= size && resolve(name);
        });
        document.documentElement.appendChild(script);
      });
    });
  },
});
i18nOption(app);

action.call(app);

app.on('render_after', 'setting');
app.addFilter('parser_hold', () => false);

bootstrap(app, (error: string, plugins?: any) => {
  !error &&
    app.init(plugins, () => {
      app.doAction('start').then(() => {
        ready(() => {
          app.doAction('load_parser');
        });
      });
    });
});
