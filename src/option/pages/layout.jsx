import React, { useState, useEffect } from 'react';
import Check from './check';
import Link from './basic/link';
import Switch from './basic/switch';
import Textarea from  './basic/textarea';
import Share from 'src/option/components/share';

export default function(){
  const [ option, setOption ] = useState({});
  const handleChange = (name, value) => {
    api.send('option', { execute: 'add', name, value }, function({error}){
      if(error){
        console.error(error);
        return;
      }
      setOption(Object.assign({}, option, {[name]: value}));
    });
  };

  useEffect(() => {
    api.send('option', { execute: 'all' }, function({error, data}){
      if(error){
        console.error(error);
        return;
      }
      setOption(data);
    });
  }, []);

  return (
    <div className="option-root">
      <h3 className="option-title">
        {api.i18n.getMessage('basic_setting')}
        <Check className="option-check" />
      </h3>
      <div className="option-list">
        <Link url="https://ranhe.xyz/circle-usage">{api.i18n.getMessage('help_center')}</Link>
        <Switch
          value={option.parser}
          onChange={val => handleChange('parser', val)}
        >
          {api.i18n.getMessage('auto_open')}
        </Switch>
        {option.parser && (
          <Textarea
            value={option.blacklist}
            onChange={val => handleChange('blacklist', val)}
          >
            {api.i18n.getMessage('blacklist')}
          </Textarea>
        )}
        <Switch
          value={option.hidepaper}
          onChange={val => handleChange('hidepaper', val)}
        >
          {api.i18n.getMessage('hide_paper')}
        </Switch>
        <div className="option-item option-chat">
          QQ 讨论组：605710052
        </div>
      </div>
      <Share />
    </div>
  );
}
