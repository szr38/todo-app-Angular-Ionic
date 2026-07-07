import { CategoryId, isCategoryId } from './category.model';

export enum TaskFilter {
  All = 'all',
  Pending = 'pending',
  Completed = 'completed',
}

export type TaskListFilter = TaskFilter | CategoryId;

export function isTaskFilter(value: string): value is TaskFilter {
  return Object.values(TaskFilter).includes(value as TaskFilter);
}

export function isTaskListFilter(value: string): value is TaskListFilter {
  return isTaskFilter(value) || isCategoryId(value);
}
