import { Injectable, computed, inject, signal } from '@angular/core';

import { FeatureFlagService } from '../../core/feature-flag.service';
import { Category, CategoryId } from '../../domain/models/category.model';
import { Task } from '../../domain/models/task.model';
import { FilterTasksUseCase, TaskFilter, TaskListFilter } from '../../domain/usecases/filter-tasks.usecase';
import { ManageTasksUseCase } from '../../domain/usecases/manage-tasks.usecase';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private manageTasks = inject(ManageTasksUseCase);
  private filterTasks = inject(FilterTasksUseCase);
  private featureFlags = inject(FeatureFlagService);

  private _tasks = signal<Task[]>([]);
  private _categories = signal<Category[]>([]);
  private _filter = signal<TaskListFilter>(TaskFilter.All);
  private _loading = signal(true);

  tasks = this._tasks.asReadonly();
  categories = this._categories.asReadonly();
  filter = this._filter.asReadonly();
  loading = this._loading.asReadonly();
  cloudSyncEnabled = this.featureFlags.cloudSync;

  visibleTasks = computed(() => this.filterTasks.apply(this._tasks(), this._filter()));

  pendingCount = computed(() => {
    let n = 0;
    for (const t of this._tasks()) {
      if (!t.completed) n++;
    }
    return n;
  });

  async init() {
    this._loading.set(true);
    const [tasks, categories] = await this.manageTasks.loadAll();
    this._tasks.set(tasks);
    this._categories.set(categories);
    this._loading.set(false);
  }

  setFilter(filter: TaskListFilter) {
    this._filter.set(filter);
  }

  async addTask(title: string, categoryId: CategoryId) {
    const task = await this.manageTasks.addTask({ title, categoryId });
    this._tasks.update((list) => [task, ...list]);
  }

  async toggleTask(task: Task) {
    const updated = await this.manageTasks.toggleComplete(task);
    this._tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
  }

  async removeTask(id: string) {
    await this.manageTasks.deleteTask(id);
    this._tasks.update((list) => list.filter((t) => t.id !== id));
  }

  async updateCategory(task: Task, categoryId: CategoryId) {
    const updated = await this.manageTasks.changeCategory(task, categoryId);
    this._tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
  }

  async toggleCloudSync() {
    const { tasks, syncFailed } = await this.manageTasks.toggleCloudSync();
    this._tasks.set(tasks);
    return syncFailed;
  }
}
