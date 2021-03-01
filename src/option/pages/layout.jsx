import React from 'react';
import Check from './check';
import Link from './basic/link';
import Switch from './basic/switch';
// import Alert from 'src/option/components/alert';
import Share from 'src/option/components/share';

export default function(){
  return (
    <div className="option-root">
      {/* <Alert className="option-alert">
        {api.i18n.getMessage('alert_msg')}
      </Alert> */}
      <h3 className="option-title">
        {api.i18n.getMessage('basic_setting')}
        <Check className="option-check" />
      </h3>
      <div className="option-list">
        <Link url="https://ranhe.xyz/circle-usage">{api.i18n.getMessage('help_center')}</Link>
        <Switch name="parser">{api.i18n.getMessage('auto_open')}</Switch>
        <Switch name="hidepaper">{api.i18n.getMessage('hide_paper')}</Switch>
        <Switch name="hideoption">{api.i18n.getMessage('hide_option')}</Switch>
        <Switch name="hidecopyright">{api.i18n.getMessage('hide_copyright')}</Switch>
      </div>
      <Share />
    </div>
  );
}
