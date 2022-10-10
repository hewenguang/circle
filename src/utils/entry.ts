import shadow from '@/utils/shadow';
import { isBoolean } from '@/utils/is';
import create from '@/utils/create';
import setStyle from '@/utils/set-style';

export interface IEntryProps {
  className?: string;
  antdStyle?: boolean;
  hookInside?: boolean;
}

export default function (options: IEntryProps = {}) {
  const app = this;
  const className = options.className;
  const classnames = ['root'];
  className && classnames.push(className);
  app.data('mobile') && classnames.push('mobile');
  const container = create('div', {
    className: classnames.join(' '),
  });
  const styleValue = window.inlineStyle;
  const style = styleValue ? [styleValue] : [];
  (isBoolean(options.antdStyle) ? options.antdStyle : true) &&
    style.unshift(app.runtime.getURL('widget/antd.css'));

  shadow({
    style,
    mode: 'open', // closed 会导致 antd select 打不开
    onReady: (shadowRoot: ShadowRoot) => {
      shadowRoot.appendChild(container);
    },
  });

  // loading 等插件不需要
  if (isBoolean(options.hookInside) ? options.hookInside : true) {
    // 支持非运行时直接打开
    app.on('render_start_after', function () {
      setStyle(container, 'display', 'block');
    });
    app.on('render_destory_after', function () {
      setStyle(container, 'display', 'none');
    });
  }

  app.on('print_change', function (active: boolean) {
    if (active) {
      setStyle(container, 'display', 'none');
    } else {
      if (isBoolean(options.hookInside) ? options.hookInside : true) {
        setStyle(container, 'display', 'block');
      }
    }
  });

  return container;
}
