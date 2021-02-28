import React, { useState } from 'react';
import Button from 'src/option/components/button';
import { installPlugin } from '../action/plugin';

export default function(props){
  const { api, plugin, update, onSuccess } = props;
  const [ loading, setLoading ] = useState(false);

  return (
    <Button
      type="primary"
      loading={loading}
      onClick={() => {
        setLoading(true);
        const newPlugin = Object.assign({}, plugin);
        delete newPlugin.remote;
        if(newPlugin.newVersion){
          newPlugin.version = newPlugin.newVersion;
          delete newPlugin.newVersion;
        }
        installPlugin(newPlugin).then(() => {
          setLoading(false);
          onSuccess && onSuccess();
        }).catch(err => {
          setLoading(false);
          console.error(err);
        });
      }}
    >
      {api.i18n.getMessage(update ? 'update' : 'install')}
    </Button>
  );
}
