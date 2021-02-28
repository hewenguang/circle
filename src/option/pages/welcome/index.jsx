import React, { useState, useEffect } from 'react';
import Button from 'src/option/components/button';
import Loading from 'src/option/components/loading';
import Progress from 'src/option/components/progress';
import { updatePlugins, getRemotePlugin } from '../action/plugin';
import './index.less';

export default function(){
  const [ percent, setPercent ] = useState(0);
  const [ status, setStatus ] = useState('running');

  useEffect(() => {
    getRemotePlugin().then(remotes => {
      const preset = remotes.preset || [];
      const plugins = (remotes.data || []).filter(item => preset.includes(item.name));
      if(plugins.length <= 0){
        setStatus(api.i18n.getMessage('error_msg'));
        return;
      }
      let multiple = 0;
      const multiplier = 100 / preset.length;
      updatePlugins(plugins, function(error){
        if(error){
          setStatus(error);
        } else {
          setStatus('success');
        }
      }, function(){
        multiple ++;
        setPercent(multiplier * multiple);
      });
    }).catch(error => {
      setStatus(error);
    });
  }, []);

  let children;
  switch(status){
    case 'running':
      children = (
        <>
          <h1>{api.i18n.getMessage('welcome')}</h1>
          <Loading>{api.i18n.getMessage('init_info')}</Loading>
          <Progress percent={percent} />
        </>
      );
      break;
    case 'success':
      children = (
        <>
          <h1>{api.i18n.getMessage('init_success')}</h1>
          <Button
            type="primary"
            onClick={() => {
              location.href = 'https://ranhe.xyz/circle-usage';
            }}
          >
            {api.i18n.getMessage('user_guide')}
          </Button>
          <Button
             onClick={() => {
               location.reload();
             }}
          >
            {api.i18n.getMessage('enter_setting')}
          </Button>
        </>
      );
      break;
    default:
      children = (
        <>
          <h1>{api.i18n.getMessage('init_warn')}</h1>
          <p className="option-error">{api.i18n.getMessage('init_error')}{status}</p>
        </>
      );
  }

  return (
    <div className="option-welcome">
      {children}
    </div>
  );
}
