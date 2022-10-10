import { debug } from '@/config';

export default function () {
  const app = this;
  if (debug) {
    return;
  }
  app.runtime.setUninstallURL(app.path('uninstall'));
  app.tabs.create({
    url: app.path(`v${app.runtime.getManifest().version}`),
  });
}
