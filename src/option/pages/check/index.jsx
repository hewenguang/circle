import React, { useState } from 'react';
import { add, get } from '../action/table';
import { getVersion } from '../action/index';
import Button from 'src/option/components/button';
import { checkPlugin, updatePlugins } from '../action/plugin';

export default function(props){
  const { className } = props;
  const [ error, setError ] = useState('');
  const [ status, setStatus ] = useState('check_update');

  return (
    <div className={className}>
      {status === 'update_error' ? `${api.i18n.getMessage(status)}${error}` : (
        <Button
          type="primary"
          loading={['updating', 'checking'].includes(status)}
          onClick={() => {
            setStatus('checking');
            getVersion().then(remoteVersion => {
              get('option', 'version').then(version => {
                if(remoteVersion <= version){
                  setStatus('latest_version');
                  return;
                }
                setStatus('updating');
                checkPlugin().then(plugins => {
                  if(plugins.length <= 0){
                    setStatus('latest_version');
                    return;
                  }
                  updatePlugins(plugins, function(error){
                    if(error){
                      setStatus('update_error');
                      setError(error);
                    } else {
                      add('option', 'version', remoteVersion).then(function(){
                        setStatus('latest_version');
                      });
                    }
                  });
                }).catch(error => {
                  setStatus('update_error');
                  setError(error);
                });
              });
            }).catch(error => {
              setStatus('update_error');
              setError(error);
            });
          }}
        >
          {api.i18n.getMessage(status)}
        </Button>
      )}
    </div>
  );
}

