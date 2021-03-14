export default function(){
  // 无法嵌入的网页去除限制响应头
  api.webRequest.onHeadersReceived.addListener(function(details){
    return {responseHeaders: details.responseHeaders.filter(header => ['content-security-policy', 'x-frame-options'].indexOf(header.name.toLowerCase()) < 0)};
  }, { urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);

  api.browserAction.onClicked.addListener(tab => {
    api.tabs.sendMessage(tab.id, {
      action: 'browserAction-click',
    });
  });

  // pjax 页面事件监听
  let timer = null;
  let changeUrl = '';
  api.tabs.onUpdated.addListener(function(tabId, changeInfo){
    if(changeInfo.status === 'loading' && changeInfo.url){
      changeUrl = changeInfo.url;
    }
    if(changeUrl && changeInfo.status === 'complete'){
      timer && clearTimeout(timer);
      timer = setTimeout(function(){
        api.tabs.sendMessage(tabId, {
          url: changeUrl,
          action: 'url-change',
        });
        changeUrl = '';
      }, 600);
    }
  });
}
