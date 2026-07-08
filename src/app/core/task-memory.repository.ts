import { Injectable } from '@angular/core';

import { TEST_TASKS } from '../data/test-tasks.data';
import { Category, DEFAULT_CATEGORIES } from '../domain/models/category.model';
import { NewTask, Task } from '../domain/models/task.model';
import { TaskRepository } from '../domain/repositories/task.repository';
import { environment } from '../../environments/environment';

@Injectable()
export class TaskMemoryRepository extends TaskRepository {
  private tasks: Task[] = environment.production ? [] : [...TEST_TASKS];
  private categories: Category[] = [...DEFAULT_CATEGORIES];

  getTasks(): Promise<Task[]> {
    return Promise.resolve(this.tasks);
  }

  getCategories(): Promise<Category[]> {
    return Promise.resolve(this.categories);
  }

  addTask(task: NewTask): Promise<Task> {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
    };

    this.tasks = [newTask, ...this.tasks];
    return Promise.resolve(newTask);
  }

  updateTask(task: Task): Promise<Task> {
    this.tasks = this.tasks.map((task) => (task.id === task.id ? task : task));
    return Promise.resolve(task);
  }

  deleteTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return Promise.resolve();
  }

  toggleCloudSync() {
    return this.getTasks().then((tasks) => ({ tasks, syncFailed: false }));
  }
}
