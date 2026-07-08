import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class CordovaNativeService {
  private done = false;

  constructor(private platform: Platform) {}

  initialize(): Promise<void> {
    if (this.done) {
      return Promise.resolve();
    }

    return this.platform.ready().then(() => {
      if (!this.platform.is('cordova')) {
        return;
      }

      const sb = window.StatusBar;
      if (sb) {
        sb.overlaysWebView(true);
        if (this.platform.is('ios')) {
          sb.styleDefault();
        } else {
          sb.styleLightContent();
          sb.backgroundColorByHexString('#3880ff');
        }
      }

      if (typeof Keyboard !== 'undefined') {
        Keyboard.hideFormAccessoryBar(true);
      }

      navigator.splashscreen?.hide();
      this.done = true;
    });
  }
}
