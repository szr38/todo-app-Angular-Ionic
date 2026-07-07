import { Injectable, computed, signal } from '@angular/core';

import { Category, CategoryId } from '../../domain/models/category.model';
import { Task } from '../../domain/models/task.model';
import { FilterTasksUseCase, TaskFilter, TaskListFilter } from '../../domain/usecases/filter-tasks.usecase';
import { ManageTasksUseCase } from '../../domain/usecases/manage-tasks.usecase';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly _tasks = signal<Task[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private readonly _filter = signal<TaskListFilter>(TaskFilter.All);
  private readonly _loading = signal(true);

  readonly tasks = this._tasks.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly visibleTasks = computed(() =>
    this.filterUseCase.apply(this._tasks(), this._filter()),
  );

  readonly pendingCount = computed(
    () => this._tasks().filter((t) => !t.completed).length,
  );

  constructor(
    private readonly manageTasks: ManageTasksUseCase,
    private readonly filterUseCase: FilterTasksUseCase,
  ) {}

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
    this._tasks.update((list) =>
      list.map((t) => (t.id === updated.id ? updated : t)),
    );
  }

  async removeTask(id: string) {
    await this.manageTasks.deleteTask(id);
    this._tasks.update((list) => list.filter((t) => t.id !== id));
  }

  async updateCategory(task: Task, categoryId: CategoryId) {
    const updated = await this.manageTasks.changeCategory(task, categoryId);
    this._tasks.update((list) =>
      list.map((t) => (t.id === updated.id ? updated : t)),
    );
  }
}
