import React from 'react';
import noop from './noop';
import App from '@/core/app.class';
import { IEntryProps } from '@/utils/entry';
import Drawer, { IProps } from '@/component/drawer';
import wrapper, { IWrapperReturnValue } from '@/component/wrapper';

export default class Plugin {
  protected container: IWrapperReturnValue;

  constructor(
    app: App,
    children?: React.ReactElement,
    props?: IProps,
    callback?: (root: HTMLElement) => void,
    options?: IEntryProps
  ) {
    this.container = {
      get: () => document.body,
      show: noop,
      hide: noop,
    };
    React.isValidElement(children) &&
      this.render(app, children, props, callback, options);
  }

  protected render(
    app: App,
    children: React.ReactElement,
    props?: IProps,
    callback?: (root: HTMLElement) => void,
    options?: IEntryProps
  ) {
    const childrenValue = props ? (
      <Drawer {...props}>{children}</Drawer>
    ) : (
      children
    );
    this.container = wrapper.call(app, childrenValue, callback, options);
  }

  start(app: App, force?: boolean) {
    if (app.data('running') && !force) {
      return;
    }
    this.container.show();
  }

  destory() {
    this.container.hide();
  }
}
