import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { FeatureFlagService } from './app/core/feature-flag.service';
import { TaskStorageRepository } from './app/core/task-storage.repository';
import { TaskRepository } from './app/domain/repositories/task.repository';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot({ name: 'todo_app' })),
    {
      provide: APP_INITIALIZER,
      useFactory: (flags: FeatureFlagService) => () => flags.initialize(),
      deps: [FeatureFlagService],
      multi: true,
    },
    { provide: TaskRepository, useClass: TaskStorageRepository },
  ],
});
