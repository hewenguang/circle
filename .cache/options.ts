import App from '../src/core/app.class';

export default function (app: App) {
  return {
    backtop: {
      keys: {
        data: {
          backtop: { title: app.i10n('backtop'), priority: 270 },
          backbottom: { title: app.i10n('backbottom'), priority: 271 },
        },
      },
      menu: {
        data: {
          backtop: { title: app.i10n('backtop'), priority: 270 },
          backbottom: { title: app.i10n('backbottom'), priority: 271 },
        },
      },
      toolbar: {
        data: [
          {
            group: 2,
            id: 'backtop',
            icon: 'UpOutlined',
            title: app.i10n('backtop'),
            priority: 270,
          },
          {
            group: 2,
            priority: 271,
            id: 'backbottom',
            icon: 'DownOutlined',
            title: app.i10n('backbottom'),
          },
        ],
      },
    },
    feedback: {
      keys: {
        data: { feedback: { title: app.i10n('feedback'), priority: 480 } },
      },
      menu: {
        data: { feedback: { title: app.i10n('feedback'), priority: 480 } },
      },
      toolbar: {
        data: [
          {
            group: 4,
            id: 'feedback',
            icon: 'FeedbackOutline',
            title: app.i10n('feedback'),
            priority: 480,
          },
        ],
      },
    },
    focus: {
      layout: {
        data: [
          { title: app.i10n('focus'), priority: 140 },
          {
            min: 0,
            max: 1,
            step: 0.1,
            id: 'focus_opacity',
            defaultValue: 0.1,
            title: app.i10n('focus_opacity'),
            priority: 140,
          },
        ],
      },
      keys: { data: { focus: { title: app.i10n('focus'), priority: 140 } } },
      menu: { data: { focus: { title: app.i10n('focus'), priority: 140 } } },
    },
    fullscreen: {
      keys: {
        data: {
          fullscreen: { title: app.i10n('fullscreen'), priority: 60 },
          fullscreen_exit: { title: app.i10n('fullscreen_exit'), priority: 61 },
        },
      },
      menu: {
        data: {
          fullscreen: { title: app.i10n('fullscreen'), priority: 60 },
          fullscreen_exit: { title: app.i10n('fullscreen_exit'), priority: 61 },
        },
      },
      toolbar: {
        data: [
          {
            group: 0,
            id: 'fullscreen',
            icon: 'FullscreenOutlined',
            title: app.i10n('fullscreen'),
            priority: 60,
          },
          {
            group: 0,
            priority: 61,
            id: 'fullscreen_exit',
            icon: 'FullscreenExitOutlined',
            title: app.i10n('fullscreen_exit'),
          },
        ],
      },
    },
    keys: {
      keys: {
        table: 'keys',
        type: 'input-switch',
        title: app.i10n('keys'),
        icon: 'ThunderboltOutlined',
        tooltip: app.i10n('keys_msg'),
        priority: 90,
      },
    },
    lists: {
      lists: {
        type: 'table',
        table: 'lists',
        priority: 100,
        title: app.i10n('lists'),
        title1: app.i10n('whitelist'),
        title2: app.i10n('blacklist'),
        icon: 'ProfileOutlined',
        data: [
          { hidden: true, field: 'deny', priority: 120 },
          { hidden: true, field: 'host', priority: 120 },
          {
            width: '40%',
            title: app.i10n('title'),
            field: 'title',
            priority: 120,
          },
          {
            type: 'url',
            width: '40%',
            title: app.i10n('url'),
            field: 'id',
            disabled: true,
            priority: 120,
          },
          { title: app.i10n('operate'), field: 'action', priority: 120 },
        ],
      },
      keys: {
        data: {
          whitelist: { title: app.i10n('toggle_whitelist'), priority: 120 },
          whitelist_site: {
            title: app.i10n('toggle_whitelist_site'),
            priority: 121,
          },
          blacklist: { title: app.i10n('toggle_blacklist'), priority: 122 },
          blacklist_site: {
            title: app.i10n('toggle_blacklist_site'),
            priority: 123,
          },
        },
      },
      menu: {
        data: {
          whitelist: { title: app.i10n('add_whitelist'), priority: 120 },
          whitelist_site: {
            title: app.i10n('add_whitelist_site'),
            priority: 121,
          },
          blacklist: { title: app.i10n('add_blacklist'), priority: 122 },
          blacklist_site: {
            title: app.i10n('add_blacklist_site'),
            priority: 123,
          },
        },
      },
      toolbar: {
        data: [
          {
            group: 1,
            id: 'whitelist',
            icon: 'WhitelistOutline',
            title: app.i10n('toggle_whitelist'),
            priority: 120,
          },
          {
            group: 1,
            priority: 121,
            id: 'whitelist_site',
            icon: 'WhitelistSiteOutline',
            title: app.i10n('toggle_whitelist_site'),
          },
          {
            group: 1,
            priority: 122,
            id: 'blacklist',
            icon: 'BlacklistOutline',
            title: app.i10n('toggle_blacklist'),
          },
          {
            group: 1,
            priority: 123,
            id: 'blacklist_site',
            icon: 'BlacklistSiteOutline',
            title: app.i10n('toggle_blacklist_site'),
          },
        ],
      },
    },
    manual: {
      keys: { data: { manual: { title: app.i10n('manual'), priority: 130 } } },
      menu: { data: { manual: { title: app.i10n('manual'), priority: 130 } } },
      toolbar: {
        data: [
          {
            group: 1,
            id: 'manual',
            icon: 'SelectOutlined',
            title: app.i10n('manual'),
            priority: 130,
          },
        ],
      },
    },
    menu: {
      menu: {
        type: 'switch',
        table: 'menu',
        title: app.i10n('menu'),
        icon: 'MenuOutlined',
        priority: 100,
      },
    },
    paper: {
      keys: { data: { paper: { title: app.i10n('paper'), priority: 80 } } },
      menu: { data: { paper: { title: app.i10n('paper'), priority: 80 } } },
      toolbar: {
        data: [
          {
            group: 0,
            id: 'paper',
            icon: 'PaperOutline',
            title: app.i10n('paper'),
            priority: 80,
          },
        ],
      },
    },
    parser: {
      keys: {
        data: {
          enter_or_exit: { title: app.i10n('enter_or_exit'), priority: 6 },
        },
      },
      menu: {
        data: {
          enter_or_exit: { title: app.i10n('enter_or_exit'), priority: 6 },
        },
      },
    },
    print: {
      keys: { data: { print: { title: app.i10n('print'), priority: 40 } } },
      menu: { data: { print: { title: app.i10n('print'), priority: 40 } } },
      toolbar: {
        data: [
          {
            group: 0,
            id: 'print',
            icon: 'PrinterOutlined',
            title: app.i10n('print'),
            priority: 40,
          },
        ],
      },
    },
    render: {
      style: {
        theme: true,
        night: true,
        reset: true,
        priority: -8,
        title: app.i10n('style'),
        icon: 'FormatPainterOutlined',
        data: [
          {
            type: 'font',
            id: 'font',
            placement: 'topLeft',
            defaultValue: 'reset',
            title: app.i10n('font'),
            tooltip: app.i10n('font_tooltip'),
            learn_more: 'node/27',
            placeholder: app.i10n('default'),
            priority: 10,
          },
          {
            type: 'font',
            id: 'cnfont',
            placement: 'topLeft',
            defaultValue: 'reset',
            title: app.i10n('cn_font'),
            placeholder: app.i10n('default'),
            priority: 10,
          },
          {
            min: 12,
            max: 50,
            unit: 'px',
            id: 'size',
            defaultValue: 20,
            title: app.i10n('size'),
            priority: 10,
          },
          {
            min: 600,
            max: 2500,
            unit: 'px',
            id: 'width',
            defaultValue: 800,
            title: app.i10n('width'),
            priority: 10,
          },
          {
            max: 10,
            unit: 'px',
            id: 'space',
            defaultValue: 0,
            title: app.i10n('space'),
            priority: 10,
          },
          {
            min: 1,
            max: 3,
            step: 0.1,
            id: 'lineheight',
            defaultValue: 1.8,
            title: app.i10n('lineheight'),
            priority: 10,
          },
          {
            min: 100,
            max: 900,
            step: 100,
            id: 'weight',
            defaultValue: 400,
            title: app.i10n('weight'),
            priority: 10,
          },
          {
            max: 50,
            step: 2,
            unit: 'px',
            id: 'blockspace',
            defaultValue: 32,
            title: app.i10n('blockspace'),
            priority: 10,
          },
          {
            max: 10,
            unit: 'em',
            id: 'indent',
            defaultValue: 0,
            title: app.i10n('indent'),
            priority: 10,
          },
          {
            id: 'titlealign',
            title: app.i10n('titlealign'),
            type: 'align',
            defaultValue: 'reset',
            placeholder: app.i10n('default'),
            priority: 10,
          },
          {
            id: 'align',
            title: app.i10n('align'),
            type: 'align',
            defaultValue: 'reset',
            placeholder: app.i10n('default'),
            priority: 10,
          },
          {
            id: 'imagealign',
            title: app.i10n('imagealign'),
            type: 'align',
            defaultValue: 'reset',
            placeholder: app.i10n('default'),
            priority: 10,
          },
          {
            type: 'switch',
            id: 'imagehide',
            defaultValue: false,
            title: app.i10n('imagehide'),
            priority: 10,
          },
        ],
      },
      skin: {
        theme: true,
        night: true,
        priority: -6,
        title: app.i10n('skin'),
        icon: 'SkinOutlined',
        data: [
          {
            type: 'color',
            id: 'theme',
            data: [
              {
                title: 'light',
                data: {
                  color: '#1b1b1b',
                  outlineColor: '#f0eded',
                  border: '1px solid #f0eded',
                  backgroundColor: '#ffffff',
                },
                value: {
                  color: '#1b1b1b',
                  link: '#416ed2',
                  hover: '#305ab7',
                  visited: '#305ab7',
                  select: '#1b1b1b',
                  selectbg: '#bbd6fc',
                  bg: '#ffffff',
                  track: '#e2e2e2',
                  thumb: '#9e9e9e',
                  radius: '4px',
                },
              },
              {
                title: 'green',
                data: {
                  color: '#282d2b',
                  outlineColor: '#c7edcc',
                  backgroundColor: '#c7edcc',
                },
                value: {
                  color: '#282d2b',
                  link: '#507964',
                  hover: '#3e6b54',
                  visited: '#3e6b54',
                  select: '#000000',
                  selectbg: '#addab4',
                  bg: '#c7edcc',
                  track: '#8fbd95',
                  thumb: '#638c6d',
                  radius: '4px',
                },
              },
              {
                title: 'yellow',
                data: {
                  color: '#4f321c',
                  outlineColor: '#f8f1e3',
                  backgroundColor: '#f8f1e3',
                },
                value: {
                  color: '#4f321c',
                  link: '#d19600',
                  hover: '#ad7d03',
                  visited: '#ad7d03',
                  select: '#4f321c',
                  selectbg: '#d19600',
                  bg: '#f8f1e3',
                  track: '#d6cfc1',
                  thumb: '#b3ac9c',
                  radius: '4px',
                },
              },
              {
                title: 'gray',
                data: {
                  color: '#b0b0b0',
                  outlineColor: '#4a4a4d',
                  backgroundColor: '#4a4a4d',
                },
                value: {
                  color: '#b0b0b0',
                  link: '#5ac8fa',
                  hover: '#3ea4d2',
                  visited: '#3ea4d2',
                  select: '#fffefe',
                  selectbg: '#43b0e2',
                  bg: '#4a4a4d',
                  track: '#4e4e50',
                  thumb: '#83838c',
                  radius: '4px',
                },
              },
              {
                title: 'dark',
                data: {
                  color: '#b0b0b0',
                  outlineColor: '#121212',
                  backgroundColor: '#121212',
                },
                value: {
                  color: '#b0b0b0',
                  link: '#5ac8fa',
                  hover: '#3ea4d2',
                  visited: '#3ea4d2',
                  select: '#fffefe',
                  selectbg: '#43b0e2',
                  bg: '#121212',
                  track: '#3c3a3a',
                  thumb: '#848484',
                  radius: '4px',
                },
              },
            ],
            priority: 10,
          },
        ],
      },
      layout: {
        theme: true,
        priority: -4,
        title: app.i10n('layout'),
        icon: 'LayoutOutlined',
        data: [
          { title: app.i10n('page'), priority: 10 },
          {
            min: 0,
            max: 100,
            step: 1,
            unit: 'px',
            id: 'margin',
            defaultValue: 80,
            title: app.i10n('margin'),
            priority: 10,
          },
        ],
      },
      keys: {
        data: {
          exit: { title: app.i10n('exit'), priority: 10 },
          exitclose: { title: app.i10n('exitclose'), priority: 20 },
          imagehide: { title: app.i10n('imagehide'), priority: 30 },
        },
      },
      menu: {
        data: {
          exit: { title: app.i10n('exit'), priority: 10 },
          exitclose: { title: app.i10n('exitclose'), priority: 20 },
          imagehide: { title: app.i10n('imagehide'), priority: 30 },
        },
      },
      toolbar: {
        data: [
          {
            group: 0,
            priority: 10,
            id: 'exit',
            icon: 'CloseOutlined',
            title: app.i10n('exit'),
          },
          {
            group: 0,
            priority: 20,
            id: 'exitclose',
            icon: 'PoweroffOutlined',
            title: app.i10n('exitclose'),
          },
          {
            group: 0,
            priority: 30,
            id: 'imagehide',
            icon: 'ImageHideOutline',
            title: app.i10n('imagehide'),
          },
        ],
      },
    },
    setting: {
      keys: {
        data: {
          setting: { title: app.i10n('setting'), priority: 50 },
          setting__style: { title: app.i10n('style'), priority: 601 },
          setting__skin: { title: app.i10n('skin'), priority: 602 },
          setting__layout: { title: app.i10n('layout'), priority: 603 },
          setting__toolbar: { title: app.i10n('toolbar'), priority: 605 },
          setting__keys: { title: app.i10n('keys'), priority: 606 },
          setting__menu: { title: app.i10n('menu'), priority: 607 },
          setting__lists: { title: app.i10n('lists'), priority: 608 },
          setting__plugin: { title: app.i10n('plugin'), priority: 609 },
          setting__config: { title: app.i10n('config'), priority: 611 },
          setting__about: { title: app.i10n('about'), priority: 612 },
        },
      },
      menu: {
        data: {
          setting: { title: app.i10n('setting'), priority: 50 },
          setting__style: { title: app.i10n('style'), priority: 601 },
          setting__skin: { title: app.i10n('skin'), priority: 602 },
          setting__layout: { title: app.i10n('layout'), priority: 603 },
          setting__toolbar: { title: app.i10n('toolbar'), priority: 605 },
          setting__keys: { title: app.i10n('keys'), priority: 606 },
          setting__menu: { title: app.i10n('menu'), priority: 607 },
          setting__lists: { title: app.i10n('lists'), priority: 608 },
          setting__plugin: { title: app.i10n('plugin'), priority: 609 },
          setting__config: { title: app.i10n('config'), priority: 611 },
          setting__about: { title: app.i10n('about'), priority: 612 },
        },
      },
      toolbar: {
        data: [
          {
            group: 0,
            id: 'setting',
            icon: 'SettingOutlined',
            title: app.i10n('setting'),
            priority: 50,
          },
          {
            group: 4,
            priority: 601,
            id: 'setting__style',
            icon: 'FormatPainterOutlined',
            title: app.i10n('style'),
          },
          {
            group: 4,
            priority: 602,
            id: 'setting__skin',
            icon: 'SkinOutlined',
            title: app.i10n('skin'),
          },
          {
            group: 4,
            priority: 603,
            id: 'setting__layout',
            icon: 'LayoutOutlined',
            title: app.i10n('layout'),
          },
          {
            group: 4,
            priority: 605,
            id: 'setting__toolbar',
            icon: 'ToolOutlined',
            title: app.i10n('toolbar'),
          },
          {
            group: 4,
            priority: 606,
            id: 'setting__keys',
            icon: 'ThunderboltOutlined',
            title: app.i10n('keys'),
          },
          {
            group: 4,
            priority: 607,
            id: 'setting__menu',
            icon: 'MenuOutlined',
            title: app.i10n('menu'),
          },
          {
            group: 4,
            priority: 608,
            id: 'setting__lists',
            icon: 'ProfileOutlined',
            title: app.i10n('lists'),
          },
          {
            group: 4,
            priority: 609,
            id: 'setting__plugin',
            icon: 'AppstoreOutlined',
            title: app.i10n('plugin'),
          },
          {
            group: 4,
            priority: 611,
            id: 'setting__config',
            icon: 'DatabaseOutlined',
            title: app.i10n('config'),
          },
          {
            group: 4,
            priority: 612,
            id: 'setting__about',
            icon: 'ExclamationCircleOutlined',
            title: app.i10n('about'),
          },
        ],
      },
      config: {
        priority: 190,
        title: app.i10n('config'),
        icon: 'DatabaseOutlined',
        data: [
          {
            type: 'local',
            id: 'local',
            priority: 10,
            hiddenLabel: true,
            title: app.i10n('local'),
            data: [
              {
                id: 'sync_export',
                title: app.i10n('sync_export'),
                data: [
                  { id: 'setting', title: app.i10n('setting') },
                  { id: 'lists', title: app.i10n('lists') },
                  { id: 'keys', title: app.i10n('keys') },
                  { id: 'menu', title: app.i10n('menu') },
                  { id: 'toolbar', title: app.i10n('toolbar') },
                ],
              },
              { id: 'sync_import', title: app.i10n('sync_import') },
            ],
          },
          {
            type: 'reset',
            id: 'reset',
            hiddenLabel: true,
            title: app.i10n('reset_all'),
            priority: 50,
          },
        ],
      },
      about: {
        priority: 200,
        title: app.i10n('about'),
        icon: 'ExclamationCircleOutlined',
        data: [
          {
            priority: 0,
            type: 'card',
            id: 'follow',
            hiddenLabel: true,
            title: app.i10n('follow'),
            tooltip: app.i10n('follow_msg'),
            data: [
              {
                title: app.i10n('wechat'),
                img: 'https://ranhe.xyz/post-images/wechat.png',
              },
              {
                title: app.i10n('qq'),
                path: 'https://qm.qq.com/cgi-bin/qm/qr?k=wseaRm8SdNiXCasA9RYwSbE_iMpblbqi&jump_from=webapi',
              },
            ],
          },
          {
            priority: 1,
            type: 'card',
            id: 'support',
            hiddenLabel: true,
            title: app.i10n('support'),
            tooltip: app.i10n('support_msg'),
            data: [
              {
                title: app.i10n('donate_coffee'),
                path: 'http://circlereader.com/donate',
              },
              {
                title: app.i10n('share_to_other'),
                path: 'https://ranhe.xyz/circle-share',
              },
            ],
          },
          {
            priority: 2,
            id: 'vote',
            type: 'vote',
            hiddenLabel: true,
            title: app.i10n('vote'),
            tooltip: app.i10n('vote_msg'),
            data: [
              { id: 'vote', type: 'primary', title: app.i10n('to_vote') },
              { id: 'feedback', title: app.i10n('to_feedback') },
            ],
          },
          {
            priority: 3,
            type: 'card',
            id: 'link',
            hiddenLabel: true,
            title: app.i10n('link'),
            data: [
              { title: app.i10n('website'), path: '', type: 'link' },
              { title: app.i10n('usage'), path: 'usage', type: 'link' },
              { title: app.i10n('agreement'), path: 'agreement', type: 'link' },
              { title: app.i10n('privacy'), path: 'privacy', type: 'link' },
              { title: app.i10n('faq'), path: 'faq', type: 'link' },
              { title: app.i10n('update'), path: 'changelog', type: 'link' },
              { title: app.i10n('feedback'), path: 'feedback', type: 'link' },
              {
                title: app.i10n('download_latest'),
                path: 'download',
                type: 'link',
              },
              { title: app.i10n('donate'), path: 'donate', type: 'link' },
            ],
          },
          { priority: 4, type: 'version', id: 'version' },
        ],
      },
    },
    toolbar: {
      toolbar: {
        table: 'toolbar',
        title: app.i10n('toolbar'),
        icon: 'ToolOutlined',
        type: 'icon-switch',
        tooltip: app.i10n('toolbar_msg'),
        priority: 70,
      },
      layout: {
        data: [
          { title: app.i10n('toolbar'), priority: 70 },
          {
            min: 0,
            max: 50,
            unit: 'px',
            id: 'itemspace',
            defaultValue: 10,
            title: app.i10n('itemspace'),
            priority: 70,
          },
          {
            min: 0,
            max: 50,
            unit: 'px',
            id: 'groupspace',
            defaultValue: 10,
            title: app.i10n('groupspace'),
            priority: 70,
          },
        ],
      },
    },
  };
}
