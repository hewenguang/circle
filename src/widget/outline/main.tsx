import cx from 'classnames';
import App from '@/core/app.class';
import useOption from '@/hooks/useOption';
import Sidepanel from '@/component/sidepanel';
import { Anchor, Tooltip, Button } from 'antd';
import React, { useRef, useEffect } from 'react';
import { PushpinOutlined } from '@ant-design/icons';

const { Link } = Anchor;

export type Item = {
  id: string;
  title: string;
  level: number;
};

interface IProps {
  app: App;
  data: Array<Item>;
}

export default function (props: IProps) {
  const { app, data } = props;
  const timer = useRef<any>(null);
  const [pinned, setPinned] = useOption({
    id: 'anchor_pinned',
    defaultValue: false,
  });
  const handlePinned = () => {
    const state = !pinned;
    setPinned(state);
    !state && app.fire('sidepanel_outline_fold', true);
  };
  const handleEnter = () => {
    if (pinned) {
      return;
    }
    timer.current && clearTimeout(timer.current);
    app.fire('sidepanel_outline_fold', false);
  };
  const handleLeave = () => {
    if (pinned) {
      return;
    }
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(function () {
      app.fire('sidepanel_outline_fold', true);
    }, 1000);
  };

  useEffect(() => {
    if (!pinned) {
      return;
    }
    app.fire('sidepanel_outline_fold', false);
  }, [pinned]);

  return (
    <Sidepanel
      id="outline"
      width={300}
      foldWidth={40}
      defaultPlacement="left"
      className={cx({ 'anchor-pinned': pinned })}
    >
      <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <Tooltip title={app.i10n(pinned ? 'hidden_outline' : 'pin_outline')}>
          <Button
            className="pin-btn"
            onClick={handlePinned}
            icon={<PushpinOutlined />}
          />
        </Tooltip>
        <Anchor className="outline">
          {data.map((item: Item) => (
            <Link
              key={item.id}
              title={item.title}
              href={`#${item.id}`}
              className={`level_${item.level}`}
            />
          ))}
        </Anchor>
      </div>
    </Sidepanel>
  );
}
