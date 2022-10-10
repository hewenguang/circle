import App from '@/core/app.class';
import choose from '@/utils/choose';
import { Space, Button } from 'antd';
import { isBoolean, isElement } from '@/utils/is';
import classname from '@/utils/classname';
import Sidepanel from '@/component/sidepanel';
import React, { useRef, useState, useEffect } from 'react';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';

interface IProps {
  app: App;
  className: string;
  onClose?: () => void;
}

export default function (props: IProps) {
  const { app, onClose, className } = props;
  const node = app.data('node') || {};
  const [time, setTime] = useState(node.time);
  const [title, setTitle] = useState(node.title);
  const [cover, setCover] = useState(node.cover);
  const [article, setArticle] = useState(node.article);
  const destory = useRef<undefined | (() => void)>(undefined);
  const handleChoose = (
    target: HTMLElement,
    callback: (node: EventTarget) => void
  ) => {
    isElement(target) && target.classList.remove(className);
    destory.current && destory.current();
    destory.current = choose(document.body, (node) => {
      if (!node) {
        return;
      }
      // @ts-ignore
      isElement(node) && node.classList.add(className);
      destory.current && destory.current();
      callback && callback(node);
    });
  };
  const handleTime = () => {
    handleChoose(time, setTime);
  };
  const handleTitle = () => {
    handleChoose(title, setTitle);
  };
  const handleCover = () => {
    handleChoose(cover, setCover);
  };
  const handleArticle = () => {
    handleChoose(article, setArticle);
  };
  const handleDestory = (delay?: any) => {
    // 清理现场
    destory.current && destory.current();
    ['time', 'title', 'cover', 'article'].forEach((item) => {
      const uid = classname(item);
      const old = document.body.querySelector(`.${uid}`);
      if (isElement(old)) {
        old && old.classList.remove(className, uid);
      }
    });
    if (isBoolean(delay) && delay) {
      onClose && setTimeout(onClose, 1000);
    } else {
      onClose && onClose();
    }
  };
  const handleClose = () => {
    // 保存数据
    app.data('node', {
      time,
      cover,
      title,
      article,
      url: location.href,
    });
    // 渲染
    if (app.used('render')) {
      app.fire('render_empty');
      app.fire('render_page');
      app.fire('render_start');
    } else {
      app.doAction('parser_ready');
    }
    handleDestory(true);
  };

  useEffect(() => {
    [
      { item: time, type: 'time' },
      { item: title, type: 'title' },
      { item: cover, type: 'cover' },
      { item: article, type: 'article' },
    ].forEach(({ type, item }) => {
      if (isElement(item)) {
        const uid = classname(type);
        const old = document.body.querySelector(`.${uid}`);
        if (isElement(old)) {
          old && old.classList.remove(className, uid);
        }
        item.classList.add(className, uid);
      }
    });
  }, [time, title, cover, article]);

  return (
    <Sidepanel id="manual" height={70} defaultPlacement="bottom">
      <Space
        style={{
          width: '100%',
          padding: '10px 0',
          justifyContent: 'center',
        }}
      >
        <Button danger type="primary" onClick={handleDestory}>
          {app.i10n('cancel')}
        </Button>
        <Button type={cover ? 'default' : 'dashed'} onClick={handleCover}>
          {app.i10n('cover_picture')}
        </Button>
        <Button type={title ? 'default' : 'dashed'} onClick={handleTitle}>
          {app.i10n('title')}
        </Button>
        <Button type={time ? 'default' : 'dashed'} onClick={handleTime}>
          {app.i10n('time')}
        </Button>
        <Button type={article ? 'default' : 'dashed'} onClick={handleArticle}>
          {app.i10n('body')}
        </Button>
        <Button
          type="primary"
          onClick={handleClose}
          disabled={!title || !article}
          icon={<CheckCircleFilled />}
        >
          {app.i10n('select_done')}
        </Button>
      </Space>
    </Sidepanel>
  );
}
