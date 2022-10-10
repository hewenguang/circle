import { debug } from '@/config';

export default function () {
  const app = this;
  app.fire('reset', () => {
    if (debug) {
      return;
    }
    app.runtime.setUninstallURL(app.path('uninstall'));
    app.tabs.create({ url: app.path('usage') });
  });
}
