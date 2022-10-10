const path = require('path');
const WebSocket = require('ws');
const chokidar = require('chokidar');
const { RawSource } = require('webpack-sources');

const DEFAULTS = {
  port: 5000,
  dist: './dist',
  entry: /^index/,
  worker: /^worker/,
};

class HotReload {
  constructor(options) {
    this._run = false;
    this.options = Object.assign({}, DEFAULTS, options);
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('hot-reload', ({ assets }, callback) => {
      Object.keys(assets).forEach((asset) => {
        if (!this.options.entry.test(asset)) {
          return;
        }
        const item = assets[asset];
        const value = item.source();
        assets[asset] = new RawSource(
          `
            if(!window._ws){
              window._ws = new WebSocket('ws://localhost:${this.options.port}');
              window._ws.addEventListener('message', e => {
                e.data === 'reload' && window.location.reload();
              });
              window._ws.addEventListener('error', e => {
                console.log('error', e);
              });
            }
            ${value}
          `
        );
      });
      callback();
    });
    // 启动服务
    if (compiler.options.watch && !this._run) {
      this._run = true;
      const wss = new WebSocket.Server({
        port: this.options.port,
      });
      wss.on('listening', () => {
        console.log('hot reload server is listening...');
      });
      wss.on('close', () => {
        console.log('hot reload server closed.');
      });
      wss.on('connection', (ws) => {
        const watcher = chokidar.watch(
          path.resolve(__dirname, this.options.dist),
          {
            ignoreInitial: true,
          }
        );
        watcher.on('all', () => {
          this._timer && clearTimeout(this._timer);
          this._timer = setTimeout(function () {
            ws.send('reload');
          });
        });
        ws.on('close', () => {
          watcher.close();
        });
      });
    }
  }
}

module.exports = HotReload;
