import { v3 } from '@/config';

export default function (
  callback: (error: string | null, data?: any) => void,
  request: any,
  sender: any
) {
  const app = this;
  const tab = sender.tab;
  const tabId = tab.id;
  const action = !v3 ? app.browserAction : app.action;

  switch (request.action) {
    case 'enable':
      action.enable(tabId, callback);
      break;
    case 'disable':
      action.disable(tabId, callback);
      break;
    case 'setIcon':
      action.setIcon(
        {
          tabId,
          path: request.value,
        },
        callback
      );
      break;
  }
}
