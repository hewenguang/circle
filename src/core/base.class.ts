import log from '@/log';
import i10ns from '@cache/i10n';
import { debug } from '@/config';
import isMobile from '@/utils/mobile';
import { isObject, isUndefined } from './is';
import Plugin, { IPluginOption } from './plugin.class';

const feedback = 'https://support.qq.com/products/317910';
const site = debug ? 'http://localhost:8888' : 'http://circlereader.com';

export default class Base extends Plugin {
  private _data: any;
  public i18n: any;
  public runtime: any;
  public permissions: any;
  public browserAction: any;
  public action: any;
  public scripting: any;
  public windows: any;
  public contextMenus: any;
  public tabs: any;
  public management: any;
  public listen: any;
  private _i10n: { [index: string]: string };

  constructor(options?: IPluginOption) {
    super(options);
    this._data = { mobile: isMobile() };
    this.listen = (request: any, sender: any, sendResponse: any) => {
      const { type } = request;
      delete request.type;
      if (!type || !this.has(type)) {
        sendResponse({ error: null });
      } else {
        // 调用原始 hook
        super.fire(
          type,
          function (error: string, data: any) {
            // error 兼容前端 error, data 的接收形式
            sendResponse({ error: error || null, data });
          },
          request,
          sender
        );
      }
      return true;
    };
    this._init();
    const lang = this.i18n.getUILanguage();
    const presetLang = ['en', 'ja', 'ko', 'th', 'zh-CN', 'zh-TW'];
    if (presetLang.includes(lang)) {
      this._i10n = i10ns[lang];
    } else {
      const value = lang.split('-').shift() || '';
      this._i10n = i10ns[presetLang.includes(value) ? value : 'en'];
    }
  }

  data(name: string, value?: any, notMerge?: boolean) {
    const returnValue = this._data[name];
    if (isUndefined(value)) {
      return returnValue;
    }
    if (value === 'destory') {
      delete this._data[name];
      return;
    }
    if (!notMerge && isObject(returnValue) && isObject(value)) {
      this._data[name] = {
        ...returnValue,
        ...value,
      };
    } else {
      this._data[name] = value;
    }
    this._data[name] = value;
  }

  private _init() {
    // browserAction 临时兼容 v2
    [
      'permissions',
      'browserAction',
      'action',
      'scripting',
      'windows',
      'contextMenus',
      'i18n',
      'runtime',
      'tabs',
    ].forEach((item) => {
      // eslint-disable-next-line no-undef
      chrome[item] && (this[item] = chrome[item]);
    });
    this.runtime.onMessage.addListener(this.listen);
  }

  i10n(name: string, substitutions?: string) {
    const lang = this._i10n[name];
    if (lang) {
      return substitutions ? lang.replace(/\$.*?\$/, substitutions) : lang;
    }
    log('i10n', name);
    try {
      return this.i18n.getMessage(name, substitutions);
    } catch (e) {
      console.log(this.runtime.lastError);
      return name;
    }
  }

  path(name?: string) {
    if (name === 'feedback') {
      return feedback;
    }
    return `${site}${name ? '/' + name : ''}`;
  }
}
