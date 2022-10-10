import App from '@/core/app.class';
import imgUrl from '@/utils/imgurl';
import remove from '@/utils/remove';
import each from '@/utils/each';
import iterator from '@/utils/iterator';
import create from '@/utils/create';
import setAttr from '@/utils/set-attr';
import nodeText from '@/utils/node-text';
import { isString, isElement } from '@/utils/is';
import React, { useRef, useEffect } from 'react';

interface IProps {
  app: App;
}

export default function ({ app }: IProps) {
  const root = useRef(null);
  const handleMouseOut = (event: any) => {
    if (!app.data('running')) {
      return;
    }
    app.fire('mouseout', event.target, event);
  };
  const handleMouseOver = (event: any) => {
    if (!app.data('running')) {
      return;
    }
    app.fire('mouseover', event.target, event);
  };

  useEffect(() => {
    if (!root || !root.current) {
      return;
    }
    const target: HTMLElement = root.current;
    app.data('container', target);
  }, []);

  useEffect(() => {
    if (!root || !root.current) {
      return;
    }
    const target: HTMLElement = root.current;
    return app.on('render_empty', (callback: () => void) => {
      target.innerHTML = '';
      callback && callback();
    });
  }, []);

  useEffect(() => {
    if (!root || !root.current) {
      return;
    }
    const target: HTMLElement = root.current;
    return app.on(
      'render_page',
      function (callback?: (article: HTMLElement) => void) {
        const node = app.data('node');
        if (!node) {
          return;
        }
        const originArticle = node.article;
        const mirrorParent = originArticle.mirrorParent;
        const originArticleClone = iterator(originArticle);
        originArticleClone._mirrorParent = originArticle._mirrorParent;
        const article = app.applyFilter('render_article', originArticleClone);
        // 加入分隔符
        mirrorParent &&
          each(article.children, function (node) {
            setAttr(node, 'role', 'separator');
          });
        const firstChild = article.firstChild;
        const cover = app.applyFilter('render_cover', node.cover);
        if (isElement(cover)) {
          const url = imgUrl(cover);
          if (isString(url) && !url.startsWith('data:')) {
            const element = create('div', {
              className: 'cover',
            });
            const coverElement = create('img', {
              src: url,
            });
            coverElement.addEventListener('load', function () {
              const width = this.naturalWidth;
              const height = this.naturalHeight;
              // 删除严重失衡宽高比图片（如 banner 广告）
              width / height > 4 && remove(element);
            });
            coverElement.addEventListener('error', function () {
              remove(element);
            });
            element.appendChild(coverElement);
            article.insertBefore(element, firstChild);
          }
        }
        const url = app.applyFilter('render_url', node.url);
        const titleElement = create('h1', { className: 'title' });
        const linkElement = create('a', { href: url, target: '_blank' });
        titleElement.appendChild(linkElement);
        article.insertBefore(titleElement, firstChild);
        const title = app.applyFilter('render_title', node.title);
        const titleText = nodeText(title);
        if (isString(titleText) && titleText.length > 0) {
          linkElement.innerText = titleText;
        }
        const time = app.applyFilter('render_time', node.time);
        if (time) {
          let timeValue = isElement(time) ? nodeText(time) : time;
          if (isString(timeValue) && timeValue.length > 0) {
            article.insertBefore(
              create('p', {
                className: 'time',
                innerText: timeValue,
              }),
              firstChild
            );
          }
        }
        article.classList.add('page');
        const renderArticle = app.applyFilter(
          'render_done',
          article,
          target,
          node
        );
        isElement(renderArticle) && target.appendChild(renderArticle);

        app.fire('render_page_after', renderArticle);
        if (callback) {
          callback(renderArticle);
        } else {
          setTimeout(() => {
            app.fire('render_page_ready', renderArticle);
          }, 100);
        }
      }
    );
  }, []);

  useEffect(() => {
    // 样式设置
    app.option('style').then((result: any) => {
      const data = result || {};
      delete data.id;
      delete data.changed;
      data && app.fire('theme', data);
      app.fire('render_start');
      app.fire('render_page', (renderArticle: HTMLElement) => {
        app.doAction('render_ready').then(() => {
          setTimeout(() => {
            app.fire('render_page_ready', renderArticle);
            app.fire('render_after');
          }, 100);
        });
      });
    });
  }, []);

  return (
    <div
      ref={root}
      className="container"
      onBlur={handleMouseOut}
      onFocus={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
    />
  );
}
