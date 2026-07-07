import { CategoryId } from './category.model';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: CategoryId;
  createdAt: number;
}

export type NewTask = Pick<Task, 'title' | 'categoryId'>;
