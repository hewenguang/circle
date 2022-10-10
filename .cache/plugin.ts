import App from '../src/core/app.class';

export default function (app: App) {
  return {
    antd: { title: 'antd' },
    autorun: {
      title: app.i10n('autorun'),
      desc: app.i10n('autorun_tooltip'),
      priority: 450,
    },
    backtop: {
      title: app.i10n('backtop'),
      priority: 270,
      apply: 'render_ready',
      deps: ['react', 'antd'],
    },
    feedback: { title: app.i10n('feedback'), priority: 480 },
    focus: {
      title: app.i10n('focus'),
      desc: app.i10n('focus_desc'),
      priority: 140,
      type: 'ui',
      beta: true,
      link: 'focus',
    },
    fullscreen: {
      title: app.i10n('fullscreen'),
      priority: 60,
      apply: 'parser_ready',
    },
    keys: {
      title: app.i10n('keys'),
      desc: app.i10n('keys_desc'),
      priority: 90,
      apply: 'start',
      link: 'keys',
    },
    lists: {
      title: app.i10n('lists'),
      priority: 120,
      apply: 'start',
      link: 'lists',
    },
    manual: {
      title: app.i10n('manual'),
      desc: app.i10n('manual_desc'),
      priority: 130,
      deps: ['react', 'antd'],
      link: 'manual',
    },
    menu: {
      title: app.i10n('menu'),
      priority: 100,
      apply: 'start',
      link: 'menu',
    },
    notice: { title: app.i10n('notice'), deps: ['react', 'antd'] },
    outline: {
      title: app.i10n('outline'),
      desc: app.i10n('outline_desc'),
      priority: 110,
      apply: 'render_ready',
      link: 'outline',
    },
    paper: {
      title: app.i10n('paper'),
      desc: app.i10n('paper_desc'),
      priority: 80,
      apply: 'dom_ready',
      type: 'ui',
      link: 'paper',
    },
    parser: { title: app.i10n('parser'), priority: 6, apply: 'load_parser' },
    print: {
      title: app.i10n('print'),
      desc: app.i10n('print_desc'),
      priority: 40,
      link: 'print',
    },
    react: { title: 'react' },
    render: {
      title: app.i10n('render'),
      priority: 10,
      apply: 'parser_ready',
      deps: ['react', 'antd'],
    },
    setting: {
      title: app.i10n('setting'),
      priority: 50,
      deps: ['react', 'antd'],
    },
    toolbar: { title: app.i10n('toolbar'), priority: 70, apply: 'dom_ready' },
  };
}
