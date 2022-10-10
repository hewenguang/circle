import App from '@/core/app.class';
import { v3 } from '@/config';

function executeScript(
  tabId: number,
  files: Array<string>,
  callback: (error?: null) => void
) {
  const app = this;
  const file = files.pop();
  if (file) {
    app.tabs.executeScript(
      tabId,
      {
        file,
        allFrames: false,
        matchAboutBlank: false,
        runAt: 'document_start',
      },
      () => {
        executeScript.call(app, tabId, files, callback);
      }
    );
  } else {
    callback();
  }
}

function done(
  app: App,
  action: string,
  tabId: number,
  property: any,
  callback: (error?: null) => void
) {
  switch (action) {
    case 'executeScript':
      if (v3) {
        app.scripting.executeScript(
          {
            target: {
              tabId,
              allFrames: false,
            },
            ...property,
          },
          () => {
            callback();
          }
        );
      } else {
        executeScript.call(app, tabId, property.files, callback);
      }
      break;
  }
}

export default function (
  callback: (error?: string | null, data?: any) => void,
  request: any,
  sender: any
) {
  const app = this;
  const property = request.value || {};
  if (sender && sender.tab && sender.tab.id) {
    done(app, request.action, sender.tab.id, property, callback);
    return;
  }
  app.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
    if (app.runtime.lastError) {
      console.log(app.runtime.lastError);
      return;
    }
    if (Array.isArray(tabs) && tabs.length > 0 && tabs[0].id) {
      done(app, request.action, tabs[0].id, property, callback);
    }
  });
}
