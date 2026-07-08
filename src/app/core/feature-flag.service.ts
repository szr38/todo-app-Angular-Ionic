import { Injectable, signal } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { fetchAndActivate, getBoolean, getRemoteConfig } from 'firebase/remote-config';

import { environment } from '../../environments/environment';
import { initializeFirebaseApp } from './firebase/firebase-app';

const REMOTE_FLAG = 'enable_cloud_sync';
const STORAGE_KEY = 'cloud_sync_enabled';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  cloudSync = signal(false);

  private initPromise?: Promise<void>;

  constructor(private storage: Storage) {}

  initialize(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.setup();
    }
    return this.initPromise;
  }

  async isCloudSyncEnabled(): Promise<boolean> {
    await this.initialize();
    return this.cloudSync();
  }

  async setCloudSyncEnabled(value: boolean): Promise<void> {
    await this.initialize();
    this.cloudSync.set(value);
    await this.storage.set(STORAGE_KEY, value);
  }

  async toggleCloudSync(): Promise<boolean> {
    const next = !(await this.isCloudSyncEnabled());
    await this.setCloudSyncEnabled(next);
    return next;
  }

  private async setup(): Promise<void> {
    await this.storage.create();

    const stored = await this.storage.get(STORAGE_KEY);
    if (stored != null) {
      this.cloudSync.set(stored === true || stored === 'true');
      return;
    }

    let fromRemote = false;
    try {
      const app = initializeFirebaseApp();
      const remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = environment.production ? 3600000 : 0;
      remoteConfig.defaultConfig = { [REMOTE_FLAG]: false };
      await fetchAndActivate(remoteConfig);
      fromRemote = getBoolean(remoteConfig, REMOTE_FLAG);
    } catch {
      console.warn('Failed to fetch remote config');
    }

    this.cloudSync.set(fromRemote);
    await this.storage.set(STORAGE_KEY, fromRemote);
  }
}
