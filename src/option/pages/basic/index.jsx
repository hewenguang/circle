import React from 'react';
import Link from './link';
import Check from './check';
import Switch from './switch';

export default function(){
  return (
    <>
      <div className="option-list">
        <Switch name="parser">{api.i18n.getMessage('auto_open')}</Switch>
        <Switch name="hidepaper">{api.i18n.getMessage('hide_paper')}</Switch>
        <Switch name="hideoption">{api.i18n.getMessage('hide_option')}</Switch>
        <Switch name="hidecopyright">{api.i18n.getMessage('hide_copyright')}</Switch>
      </div>
      <h3 className="option-title">{api.i18n.getMessage('help_center')}</h3>
      <div className="option-list">
        <Link url="https://ranhe.xyz/circle-usage">
          {api.i18n.getMessage('usage')}
        </Link>
        <Link url="https://ranhe.xyz/circle-faq">
          {api.i18n.getMessage('faq')}
        </Link>
        <Link url="https://ranhe.xyz/circle-feature">
          {api.i18n.getMessage('feature')}
        </Link>
        <Link url="https://ranhe.xyz/circle-feedback">
          {api.i18n.getMessage('feedback')}
        </Link>
        <Link url="https://ranhe.xyz/circle-changelog">
          {api.i18n.getMessage('changelog')}
        </Link>
        <Link url="https://ranhe.xyz/circle">
          {api.i18n.getMessage('about')}
        </Link>
        <Check />
      </div>
    </>
  );
}
