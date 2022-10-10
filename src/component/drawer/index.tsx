import App from '@/core/app.class';
import { ConfigProvider } from 'antd';
import maxZindex from '@/utils/zindex';
import { isBoolean } from '@/utils/is';
import React, { useState, useEffect } from 'react';
import Body from './body';
import './index.less';

export interface IProps {
  mask?: boolean;
  plugin: string;
  visible?: boolean;
  width?: number | string;
  type?: 'toolbar' | 'modal';
  onClose?: (app: App) => void;
  children?: React.ReactElement;
  componentSize?: 'small' | 'middle' | 'large';
  [index: string]: any;
}

export default function (props: IProps) {
  const {
    app,
    root,
    type,
    plugin,
    onClose,
    visible,
    children,
    width = 378,
    mask = false,
    componentSize = 'small',
    ...resetProps
  } = props;
  const controlled = isBoolean(visible);
  const rootElement = app.data('root');
  const [zIndex, setZIndex] = useState(1000);
  const [show, setShow] = useState<boolean | null>(null);
  // const dirIsRtl = getDir() === 'rtl';
  const visibleValue = controlled ? visible : show;
  const handleClose = () => {
    onClose && onClose(app);
    !controlled && app.fire('drawer', plugin);
  };

  useEffect(() => {
    const zIndex = maxZindex();
    zIndex && setZIndex(zIndex);
  }, []);

  useEffect(() => {
    return app.on('drawer_visible', (visible: boolean) => {
      if (visible) {
        app.running(plugin) && (root.style.display = 'block');
      } else {
        root.style.display = 'none';
      }
    });
  }, []);

  useEffect(() => {
    return app.on('drawer', function (name: string, open: boolean) {
      if (controlled) {
        return;
      }
      if (plugin === name) {
        if (rootElement) {
          if (show) {
            if (open) {
              return;
            }
            !app.data('mobile') &&
              rootElement.style.removeProperty('padding-right');
            setTimeout(function () {
              app.fire('toolbar_state', plugin, 'inactive');
            }, 0);
          } else {
            !app.data('mobile') &&
              rootElement.style.setProperty(
                'padding-right',
                !type ? `${width}px` : '1px'
              );
            setTimeout(function () {
              app.fire('toolbar_state', plugin, 'active');
            }, 0);
          }
        }
        setShow(!show);
        app.data('drawer', show ? '' : name);
        app.fire(`drawer_${name}_change`, !show);
      } else {
        setShow(false);
        show && app.fire(`drawer_${plugin}_change`, false);
      }
    });
  }, [show]);

  let widthValue = width;
  if (app.data('mobile')) {
    switch (type) {
      case 'toolbar':
        break;
      case 'modal':
        widthValue = '90%';
        break;
      default:
        widthValue = '100%';
    }
  }

  return (
    <ConfigProvider
      componentSize={componentSize}
      // direction={dirIsRtl ? 'rtl': 'ltr'}
      getPopupContainer={(trigger?: HTMLElement | undefined) =>
        trigger ? trigger.parentElement : root
      }
    >
      <Body
        {...resetProps}
        root={root}
        type={type}
        mask={mask}
        style={{ zIndex }}
        width={widthValue}
        onClose={handleClose}
        open={visibleValue}
      >
        {children}
      </Body>
    </ConfigProvider>
  );
}
