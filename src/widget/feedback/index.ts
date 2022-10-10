import App from '@/core/app.class';

class Plugin {
  action(app: App) {
    app.send('tab', {
      action: 'create',
      value: { url: app.path('feedback') },
    });
  }
}

window.definePlugin('feedback', Plugin);
