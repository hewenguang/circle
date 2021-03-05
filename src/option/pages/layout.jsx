import React, { useState, useEffect } from 'react';
import Check from './check';
import Link from './basic/link';
import Switch from './basic/switch';
import Textarea from  './basic/textarea';
import Share from 'src/option/components/share';

export default function(){
  const [ option, setOption ] = useState({});
  const handleChange = (name, value) => {
    api.send('analytics-click', {event: `option-${name}`});
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
        <Switch
          value={option.parser}
          onChange={val => handleChange('parser', val)}
        >
          {api.i18n.getMessage('auto_open')}
        </Switch>
        {option.parser && (
          <Textarea
            value={option.blacklist}
            placeholder={api.i18n.getMessage('list_rule')}
            onChange={val => handleChange('blacklist', val)}
          >
            {api.i18n.getMessage('blacklist')}
          </Textarea>
        )}
        <Textarea
          value={option.whitelist}
          placeholder="匹配自动开启"
          onChange={val => handleChange('whitelist', val)}
        >
          {api.i18n.getMessage('whitelist')}
        </Textarea>
      </div>
      <h3 className="option-title">
        {api.i18n.getMessage('help_center')}
        <Share />
      </h3>
      <div className="option-list">
        <Link url="https://github.com/hewenguang/circle/issues">{api.i18n.getMessage('feedback')}</Link>
        <Link url="https://github.com/hewenguang/circle/wiki/Circle-%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E7%AE%80%E6%98%8E%E6%95%99%E7%A8%8B">{api.i18n.getMessage('usage')}</Link>
        <Link url="https://github.com/hewenguang/circle">{api.i18n.getMessage('source_code')}</Link>
        <div className="option-item option-donate">{api.i18n.getMessage('donate')}<img src="../assets/img/donate.jpg" /></div>
        <div className="option-item">{api.i18n.getMessage('contact')}<br />{api.i18n.getMessage('discussion_group')}</div>
      </div>
    </div>
  );
}
