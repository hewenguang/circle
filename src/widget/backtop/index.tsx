import React from 'react';
import App from '@/core/app.class';
import setStyle from '@/utils/set-style';
import Home from './home';
import PluginBase from '@/utils/plugin.class';
import './index.less';

class Plugin extends PluginBase {
  constructor(app: App) {
    super(app, <Home />);
  }

  onBacktopVisible(app: App, visible: boolean) {
    const root = this.container.get();
    setStyle(root, 'display', visible ? 'block' : 'none');
  }

  onBacktop() {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: window.pageYOffset > 2000 ? 'auto' : 'smooth',
    });
  }

  onBackbottom() {
    window.scrollTo({
      left: 0,
      top: document.documentElement.scrollHeight,
      behavior: window.pageYOffset > 2000 ? 'auto' : 'smooth',
    });
  }
}

window.definePlugin('backtop', Plugin);
