import React from 'react';
import Tabs from '../components/tabs';
import Footer from './footer';
import Basic from  './module/basic';
import Help from './module/help';

export default function(){

  return (
    <>
      <Tabs
        className="option-root"
        options={{
          basic: {
            title: api.i18n.getMessage('basic_setting'),
            value: <Basic />
          },
          help: {
            title: api.i18n.getMessage('help_center'),
            value: <Help />
          },
        }}
      />
      <Footer />
    </>
  );
}
