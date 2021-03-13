import React, { useState, useEffect } from 'react';
import Button from 'src/components/button';
import Loading from 'src/components/loading';
import Progress from 'src/components/progress';
import { getPlugins } from '../action/index';
import { updatePlugins } from '../action/plugin';
import './index.less';

export default function(){
  const [ percent, setPercent ] = useState(0);
  const [ status, setStatus ] = useState('running');

  useEffect(() => {
    getPlugins().then(remotes => {
      const plugins = remotes.data || [];
      const pluginsLen = plugins.length;
      if(pluginsLen <= 0){
        setStatus(api.i18n.getMessage('error_msg'));
        return;
      }
      let multiple = 0;
      const multiplier = 100 / pluginsLen;
      updatePlugins(plugins, function(error){
        if(error){
          setStatus(error);
        } else {
          api.send('write-version',function(){
            setStatus('success');
          });
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
            href="https://ranhe.xyz/circle-usage"
          >
            {api.i18n.getMessage('user_guide')}
          </Button>
          <Button onClick={()=>location.reload()}>
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
    <div className="option-root option-welcome">
      {children}
    </div>
  );
}
