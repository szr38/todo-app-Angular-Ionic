import { Injectable } from '@angular/core';

import { TaskFilter, TaskListFilter } from '../models/task-filter.model';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class FilterTasksUseCase {
  apply(tasks: Task[], filter: TaskListFilter): Task[] {
    if (filter === TaskFilter.All) {
      return tasks;
    }

    if (filter === TaskFilter.Pending) {
      return tasks.filter((t) => !t.completed);
    }

    if (filter === TaskFilter.Completed) {
      return tasks.filter((t) => t.completed);
    }

    return tasks.filter((t) => t.categoryId === filter);
  }
}

export { TaskFilter, TaskListFilter, isTaskFilter, isTaskListFilter } from '../models/task-filter.model';
