import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { environment } from '../../environments/environment';
import { TEST_TASKS } from '../data/test-tasks.data';
import { Category, DEFAULT_CATEGORIES } from '../domain/models/category.model';
import { NewTask, Task } from '../domain/models/task.model';
import { TaskRepository } from '../domain/repositories/task.repository';
import { FeatureFlagService } from './feature-flag.service';
import { TaskCloudRepository } from './task-cloud.repository';

const TASKS_KEY = 'tasks';

@Injectable()
export class TaskStorageRepository extends TaskRepository {
  private tasks: Task[] = [];
  private categories = [...DEFAULT_CATEGORIES];
  private ready: Promise<void>;

  constructor(
    private storage: Storage,
    private featureFlags: FeatureFlagService,
    private cloud: TaskCloudRepository,
  ) {
    super();
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    await this.storage.create();
    await this.featureFlags.initialize();

    const stored = await this.storage.get(TASKS_KEY);
    if (Array.isArray(stored)) {
      this.tasks = stored;
    } else {
      this.tasks = environment.production ? [] : [...TEST_TASKS];
      await this.storage.set(TASKS_KEY, this.tasks);
    }

    if (await this.featureFlags.isCloudSyncEnabled()) {
      await this.pullFromCloud();
    }
  }

  private async save(): Promise<void> {
    await this.ready;
    await this.storage.set(TASKS_KEY, this.tasks);
  }

  private async pullFromCloud(): Promise<void> {
    try {
      const remote = await this.cloud.getTasks();
      const merged = new Map(remote.map((t) => [t.id, t]));
      for (const t of this.tasks) {
        merged.set(t.id, t);
      }
      this.tasks = [...merged.values()].sort((a, b) => b.createdAt - a.createdAt);
      await this.storage.set(TASKS_KEY, this.tasks);
    } catch (err) {
      if (!environment.production) {
        console.error('No se pudo traer tareas de la nube', err);
      }
    }
  }

  private async pushToCloud(task: Task): Promise<void> {
    if (!(await this.featureFlags.isCloudSyncEnabled())) {
      return;
    }

    try {
      await this.cloud.saveTask(task);
    } catch (err) {
      if (!environment.production) {
        console.error('No se pudo guardar en la nube', err);
      }
    }
  }

  async getTasks(): Promise<Task[]> {
    await this.ready;
    return [...this.tasks];
  }

  getCategories(): Promise<Category[]> {
    return Promise.resolve(this.categories);
  }

  async addTask(data: NewTask): Promise<Task> {
    await this.ready;

    const task: Task = {
      ...data,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
    };

    this.tasks.unshift(task);
    await this.save();
    await this.pushToCloud(task);
    return task;
  }

  async updateTask(task: Task): Promise<Task> {
    await this.ready;

    const idx = this.tasks.findIndex((t) => t.id === task.id);
    if (idx !== -1) {
      this.tasks[idx] = task;
    }

    await this.save();
    await this.pushToCloud(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.ready;

    this.tasks = this.tasks.filter((t) => t.id !== id);
    await this.save();

    if (await this.featureFlags.isCloudSyncEnabled()) {
      try {
        await this.cloud.deleteTask(id);
      } catch (err) {
        if (!environment.production) {
          console.error('No se pudo borrar en la nube', err);
        }
      }
    }
  }

  async toggleCloudSync(): Promise<{ tasks: Task[]; syncFailed: boolean }> {
    await this.ready;

    const on = await this.featureFlags.toggleCloudSync();
    let syncFailed = false;

    if (on) {
      try {
        await this.pullFromCloud();
        for (const task of this.tasks) {
          await this.cloud.saveTask(task);
        }
      } catch (err) {
        syncFailed = true;
        if (!environment.production) {
          console.error('Error al activar sync', err);
        }
      }
    }

    return { tasks: [...this.tasks], syncFailed };
  }
}
