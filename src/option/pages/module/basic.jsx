import React, { useState, useEffect } from 'react';
import Switch from '../components/switch';
import Textarea from  '../components/textarea';

export default function(){
  const [ option, setOption ] = useState({});
  const handleChange = (name, value) => {
    !(typeof value === 'string' && value.length <= 0) && api.send('analytics-click', {event: `option-${name}`});
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
    <div className="option-list">
      <Textarea
        value={option.whitelist}
        placeholder={api.i18n.getMessage('whitelist_rule')}
        onChange={val => handleChange('whitelist', val)}
      >
        {api.i18n.getMessage('whitelist')}
      </Textarea>
      <Switch
        value={option.parser}
        onChange={val => handleChange('parser', val)}
      >
        {api.i18n.getMessage('auto_open')}
      </Switch>
      {option.parser && (
        <Textarea
          className="option-parser"
          value={option.ignore}
          placeholder={api.i18n.getMessage('ignore_rule')}
          onChange={val => handleChange('ignore', val)}
        >
          {api.i18n.getMessage('ignore')}
        </Textarea>
      )}
      <Switch
        value={option.hidepaper}
        onChange={val => handleChange('hidepaper', val)}
      >
        {api.i18n.getMessage('hide_paper')}
      </Switch>
      <Switch
        value={option.disable_nextpage}
        onChange={val => handleChange('disable_nextpage', val)}
      >
        {api.i18n.getMessage('disable_nextpage')}
      </Switch>
      {/* <Textarea
        value={option.blacklist}
        placeholder={api.i18n.getMessage('blacklist_rule')}
        onChange={val => handleChange('blacklist', val)}
      >
        {api.i18n.getMessage('blacklist')}
      </Textarea> */}
    </div>
  );
}
