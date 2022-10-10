export default function (tabId: number, changeInfo: any, tab: any) {
  // 完成之后再发消息
  if (!changeInfo || changeInfo.status !== 'complete') {
    return;
  }
  const app = this;
  app.send('tab_updated', {
    changeInfo,
    update: tab,
    tab: {
      id: tabId,
    },
  });

  // for clipper
  const url = tab.url;
  if (!url || url.indexOf('circlereader.com/oauth2') <= 1) {
    return;
  }
  const search = url.split('?').pop();
  if (!search) {
    return;
  }
  app.fire(
    'tab',
    () => {
      app.send('redirect', { query: search });
    },
    { action: 'remove' },
    { tab: { id: tabId } }
  );
}
