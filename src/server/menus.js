export default function(){
  api.contextMenus.create({
    title: api.i18n.getMessage('contextmenu_name'),
    id: 'circle',
  });
  api.contextMenus.create({
    title: api.i18n.getMessage('contextmenu_focus'),
    parentId:'circle',
    id: 'focus',
    onclick: (info, tab) => {
      if(info.pageUrl.startsWith('chrome')){
        return;
      }
      api.tabs.sendMessage(tab.id, {action: 'menu-focus'});
    },
  });
  api.contextMenus.create({
    title: '本站加入/移除白名单',
    parentId:'circle',
    id: 'site-whitelist',
    onclick: (info, tab) => {
      if(info.pageUrl.startsWith('chrome')){
        return;
      }
      api.tabs.sendMessage(tab.id, {action: 'menu-site-whitelist'});
    },
  });
  api.contextMenus.create({
    title: '本文加入/移除白名单',
    parentId:'circle',
    id: 'article-whitelist',
    onclick: (info, tab) => {
      if(info.pageUrl.startsWith('chrome')){
        return;
      }
      api.tabs.sendMessage(tab.id, {action: 'menu-article-whitelist'});
    },
  });
  api.contextMenus.create({
    title: '[Ctrl+O]进入选项页',
    parentId:'circle',
    id: 'options',
    onclick: () => app.doAction('open-option-page'),
  });
}