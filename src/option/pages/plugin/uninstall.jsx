import React, { useState } from 'react';
import Button from 'src/option/components/button';
import { remove } from '../action/table';

export default function(props){
  const { api, name, disabled, onSuccess } = props;
  const [ loading, setLoading ] = useState(false);

  return (
    <Button
      type="danger"
      loading={loading}
      disabled={disabled}
      onClick={() => {
        setLoading(true);
        remove('plugin', name).then(() => {
          setLoading(false);
          onSuccess && onSuccess();
        }).catch(err => {
          setLoading(false);
          console.error(err);
        });
      }}
    >
      {api.i18n.getMessage(disabled ? 'builtin' : 'uninstall')}
    </Button>
  );
}
