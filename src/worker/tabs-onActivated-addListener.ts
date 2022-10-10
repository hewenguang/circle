export default function (activeInfo: any) {
  this.send('tab_activated', {
    windowId: activeInfo.windowId,
    tab: {
      id: activeInfo.tabId,
    },
  });
}
