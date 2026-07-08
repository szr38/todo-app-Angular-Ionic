import { CategoryId, isCategoryId } from './category.model';

export enum TaskFilter {
  All = 'all',
  Pending = 'pending',
  Completed = 'completed',
}

export type TaskListFilter = TaskFilter | CategoryId;

const TASK_FILTERS = new Set<string>(Object.values(TaskFilter));

export function isTaskFilter(value: string): value is TaskFilter {
  return TASK_FILTERS.has(value);
}

export function isTaskListFilter(value: string): value is TaskListFilter {
  return isTaskFilter(value) || isCategoryId(value);
}
