export default function(app){
  app.addAction('fetch', function(callback, { request }){
    api.fetch(request.url, function(error, data){
      callback(error, data);
    }, request.type);
  });
  app.addAction('open-option-page', function(){
    api.runtime.openOptionsPage();
  });
  app.addAction('cc-active', function(callback, { sender }){
    app.change(sender.tab.id, function(){
      callback(null);
    }, 'active');
  });
  app.addAction('cc-inactive', function(callback, { sender }){
    app.change(sender.tab.id, function(){
      callback(null);
    }, 'enable');
  });
  app.addAction('cc-enable', function(callback, { sender }){
    app.change(sender.tab.id, function(){
      callback(null);
    }, 'enable', 'enable');
  });
  app.addAction('cc-disable', function(callback, { sender }){
    app.change(sender.tab.id, function(){
      callback(null);
    }, 'disable', 'disable');
  });
}
