import cx from 'classnames';
import useApp from '@/hooks/useApp';
import { isElement } from '@/utils/is';
import maxZindex from '@/utils/zindex';
import useOption from '@/hooks/useOption';
import { DrawerProps } from 'antd/es/drawer';
import { Drawer, Button, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import './index.less';

type Item = {
  tooltip: string;
  icon: React.ReactNode;
};

interface IProps {
  fold?: Item;
  unfold?: Item;
  id: string;
  width?: number;
  foldWidth?: number;
  title?: string;
  noStyle?: boolean;
  className?: string;
  forceRender?: boolean;
  children: React.ReactNode;
  defaultFolded?: boolean;
  defaultPlacement?: DrawerProps['placement'];
  [index: string]: any;
}

export default function (props: IProps) {
  const {
    id,
    title,
    width = 280,
    foldWidth = 0,
    noStyle,
    className,
    children,
    forceRender = true,
    defaultFolded = true,
    defaultPlacement = 'right',
    fold,
    unfold,
    ...resetProps
  } = props;
  const { app, root } = useApp(false);
  const [zIndex, setZIndex] = useState(1000);
  const [folded, setFolded] = useOption({
    id: `${id}_fold`,
    defaultValue: defaultFolded,
  });
  const [placement, setPlacement] = useOption({
    id: `${id}_placement`,
    defaultValue: defaultPlacement,
  });
  const handleFold = () => {
    setFolded(!folded);
  };
  const resize = () => {
    if (
      folded ||
      !['left', 'right'].includes(placement) ||
      app.data('mobile') ||
      width < 50
    ) {
      return;
    }
    const container = app.data('container');
    if (!isElement(container)) {
      return;
    }
    const rootElement = root.querySelector('.ant-drawer-content-wrapper');
    if (!isElement(rootElement)) {
      return;
    }
    let widthValue = width;
    const rect = container.getBoundingClientRect();
    if (placement === 'left') {
      widthValue = rect.left;
    } else {
      widthValue = window.innerWidth - rect.right;
    }
    if (widthValue > width) {
      widthValue = width;
    } else if (widthValue < 160) {
      widthValue = 160;
    }
    rootElement.style.width = `${widthValue}px`;
  };

  useEffect(() => {
    const foldListener = app.on(`sidepanel_${id}_fold`, setFolded);
    const placementListener = app.on(`layout_${id}_placement`, setPlacement);
    const visibleListener = app.on('drawer_visible', (visible: boolean) => {
      if (visible) {
        app.running(id) && (root.style.display = 'block');
      } else {
        root.style.display = 'none';
      }
    });
    const zIndex = maxZindex();
    zIndex && setZIndex(zIndex);
    return () => {
      foldListener();
      visibleListener();
      placementListener();
    };
  }, []);

  useEffect(() => {
    resize();
    return app.on('resize', resize);
  }, [folded, placement, width]);

  return (
    <Drawer
      {...resetProps}
      open
      mask={false}
      title={title}
      closable={false}
      style={{ zIndex }}
      placement={placement}
      getContainer={() => root}
      width={folded ? foldWidth : width}
      className={cx(`sidepanel-${folded ? 'close' : 'open'}`, className, {
        sidepanel: !noStyle,
      })}
    >
      {fold && unfold && (
        <Tooltip title={folded ? fold.tooltip : unfold.tooltip}>
          <Button
            onClick={handleFold}
            className="sidepanel-btn"
            type={folded ? 'default' : 'text'}
            icon={folded ? fold.icon : unfold.icon}
          />
        </Tooltip>
      )}
      {(forceRender || !folded) && children}
    </Drawer>
  );
}
