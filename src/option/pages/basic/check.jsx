import React, { useState } from 'react';
import Button from 'src/option/components/button';
import Loading from 'src/option/components/loading';
import { checkPlugin, updatePlugins } from '../action/plugin';

export default function(){
  const [ status, setStatus ] = useState('default');

  let children;
  switch(status){
    case 'default':
      children = (
        <Button
          type="primary"
          onClick={() => {
            setStatus('runing');
            checkPlugin().then(plugins => {
              plugins.length > 0 && setStatus('update');
              updatePlugins(plugins, function(error){
                if(error){
                  setStatus(error);
                } else {
                  setStatus('success');
                }
              });
            }).catch(error => {
              setStatus(error);
            });
          }}
        >
          {api.i18n.getMessage('check')}
        </Button>
      );
      break;
    case 'update':
      children = (
        <Loading>{api.i18n.getMessage('updating')}</Loading>
      );
      break;
    case 'runing':
      children = (
        <Loading>{api.i18n.getMessage('checking')}</Loading>
      );
      break;
    case 'success':
      children = api.i18n.getMessage('latest_version');
      break;
    default:
      children = (
        <span className="option-error">
          {api.i18n.getMessage('update_error')}{status}
        </span>
      );
  }

  return (
    <div className="option-item">
      {api.i18n.getMessage('check_update')}
      <div className="option-buttons">
        {children}
      </div>
    </div>
  );
}
