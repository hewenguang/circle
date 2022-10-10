import ready from '@/utils/ready';
import App from '@/core/app.class';
import action from '@/utils/action';
import bootstrap from './bootstrap';

const app = new App();

action.call(app);

(function () {
  bootstrap(app, (error: string, plugins?: any) => {
    !error &&
      app.init(plugins, async () => {
        app.doAction('start').then(() => {
          ready(() => {
            app.doAction('load_parser');
          });
        });
      });
  });
})();
