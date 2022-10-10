export default function (
  callback: (error?: null | string, data?: any) => void,
  {
    action,
    value,
  }: {
    action: string;
    value: any;
  },
  sender: {
    tab: {
      id: number;
    };
  }
) {
  const app = this;
  const tabId = sender && sender.tab ? sender.tab.id : 0;
  const property = value || {};
  switch (action) {
    case 'create':
      app.tabs.create(property, (tab: any) => {
        callback && callback(null, tab);
      });
      break;
    case 'update':
      app.tabs.update(tabId, property, (tab: any) => {
        callback && callback(null, tab);
      });
      break;
    case 'remove':
      app.tabs.remove(tabId, callback);
      break;
    case 'captureVisibleTab':
      app.tabs.captureVisibleTab(property, (dataUrl: string) => {
        callback && callback(null, dataUrl);
      });
      break;
    case 'query':
      app.tabs.query(property, (tabs: any) => {
        callback && callback(null, tabs);
      });
      break;
  }
}
