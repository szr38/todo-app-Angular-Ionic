import { Injectable } from '@angular/core';

import { CategoryId } from '../models/category.model';
import { NewTask, Task } from '../models/task.model';
import { TaskRepository } from '../repositories/task.repository';

@Injectable({ providedIn: 'root' })
export class ManageTasksUseCase {
  constructor(private repo: TaskRepository) {}

  loadAll() {
    return Promise.all([this.repo.getTasks(), this.repo.getCategories()]);
  }

  addTask(data: NewTask) {
    return this.repo.addTask(data);
  }

  toggleComplete(task: Task) {
    return this.repo.updateTask({ ...task, completed: !task.completed });
  }

  deleteTask(id: string) {
    return this.repo.deleteTask(id);
  }

  changeCategory(task: Task, categoryId: CategoryId) {
    return this.repo.updateTask({ ...task, categoryId });
  }

  toggleCloudSync() {
    return this.repo.toggleCloudSync();
  }
}
