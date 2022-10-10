import log from '@/log';
import App from '@/core/app.class';

type Item = 'fullscreen' | 'normal';

class Plugin {
  private _state: Item = 'normal';

  private getState(app: App) {
    return new Promise<Item>((resolve, reject) => {
      app.send(
        'windows',
        {
          action: 'get',
        },
        (error, data) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(data.state);
        }
      );
    });
  }

  private setFullscreen(app: App, fullscreen: boolean) {
    app.send(
      'windows',
      {
        action: 'update',
        state: fullscreen ? 'fullscreen' : 'normal',
      },
      (error) => {
        if (error) {
          log(error);
          return;
        }
        app.fire('fullscreen_change', fullscreen);
        app.fire('toolbar_state', [
          ['fullscreen', fullscreen ? 'hidden' : 'visible'],
          ['fullscreen_exit', fullscreen ? 'visible' : 'hidden'],
        ]);
      }
    );
  }

  private filterIsFullscreen() {
    return this._state === 'fullscreen';
  }

  onFullscreen(app: App) {
    !this.filterIsFullscreen() && this.setFullscreen(app, true);
  }

  onFullscreenExit(app: App) {
    this.filterIsFullscreen() && this.setFullscreen(app, false);
  }

  // 切换事件监听。onBoundsChanged 火狐不兼容
  onResize(app: App) {
    this.getState(app).then((state: Item) => {
      if (!['fullscreen', 'normal'].includes(state)) {
        return;
      }
      if (state === this._state) {
        return;
      }
      this._state = state;
      app.fire('fullscreen_change', state === 'fullscreen');
    });
  }

  start(app: App) {
    this.getState(app).then((state: Item) => {
      this._state = state;
    });
  }

  onDrawerSettingChange(app: App, visible: boolean) {
    // 会和 setting 冲突，延迟处理
    setTimeout(() => {
      if (visible) {
        app.fire('toolbar_state', [
          ['fullscreen', 'visible'],
          ['fullscreen_exit', 'visible'],
        ]);
        return;
      }
      this.toggle(app);
    }, 1000);
  }

  onToolbarReady(app: App) {
    this.toggle(app);
  }

  toggle(app: App) {
    const fullscreen = this.filterIsFullscreen();
    app.fire('toolbar_state', [
      ['fullscreen', fullscreen ? 'hidden' : 'visible'],
      ['fullscreen_exit', fullscreen ? 'visible' : 'hidden'],
    ]);
  }
}

window.definePlugin('fullscreen', Plugin);
