export default function (action?: 'ready' | 'enable' | 'disable') {
  const app = this;

  switch (action) {
    case 'ready':
      app.send('action', { action: 'enable' });
      app.send('action', {
        action: 'setIcon',
        value: {
          16: 'icons/16.png',
          32: 'icons/32.png',
        },
      });
      break;
    case 'enable':
      app.send('action', { action: 'enable' });
      app.send('action', {
        action: 'setIcon',
        value: {
          16: 'icons/16-done.png',
          32: 'icons/32-done.png',
        },
      });
      break;
    case 'disable':
      app.send('action', { action: 'enable' });
      app.send('action', {
        action: 'setIcon',
        value: {
          16: 'icons/16-disable.png',
          32: 'icons/32-disable.png',
        },
      });
      break;
    default:
      app.send('action', { action: 'disable' });
      app.send('action', {
        action: 'setIcon',
        value: {
          16: 'icons/16-default.png',
          32: 'icons/32-default.png',
        },
      });
  }
}
