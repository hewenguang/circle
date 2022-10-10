export default function (
  callback: (error?: null, data?: any) => void,
  {
    url,
    action,
    state,
  }: {
    url: string;
    action: string;
    state: string;
  }
) {
  const app = this;
  switch (action) {
    case 'current':
      app.windows.getCurrent((instance: any) => {
        callback && callback(null, instance);
      });
      break;
    case 'create':
      app.windows.create({ url }, (instance: any) => {
        callback && callback(null, instance);
      });
      break;
    case 'get':
      app.windows.get(app.windows.WINDOW_ID_CURRENT, (instance: any) => {
        callback && callback(null, instance);
      });
      break;
    case 'update':
      // "normal", "minimized", "maximized", "fullscreen", or "locked-fullscreen"
      app.windows.update(
        app.windows.WINDOW_ID_CURRENT,
        { state },
        (instance: any) => {
          callback && callback(null, instance);
        }
      );
      break;
  }
}
