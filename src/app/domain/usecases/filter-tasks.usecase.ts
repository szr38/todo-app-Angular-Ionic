import { Injectable } from '@angular/core';

import { TaskFilter, TaskListFilter } from '../models/task-filter.model';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class FilterTasksUseCase {
  apply(tasks: Task[], filter: TaskListFilter): Task[] {
    switch (filter) {
      case TaskFilter.All:
        return tasks;
      case TaskFilter.Pending:
        return tasks.filter((t) => !t.completed);
      case TaskFilter.Completed:
        return tasks.filter((t) => t.completed);
      default:
        return tasks.filter((t) => t.categoryId === filter);
    }
  }
}

export { TaskFilter, TaskListFilter, isTaskFilter, isTaskListFilter } from '../models/task-filter.model';
