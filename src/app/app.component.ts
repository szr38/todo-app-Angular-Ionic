import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { CordovaNativeService } from './core/cordova/cordova-native.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly cordovaNative = inject(CordovaNativeService);

  ngOnInit() {
    void this.cordovaNative.initialize();
  }
}
