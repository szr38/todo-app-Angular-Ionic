import { Category } from '../models/category.model';
import { NewTask, Task } from '../models/task.model';

export abstract class TaskRepository {
  abstract getTasks(): Promise<Task[]>;
  abstract getCategories(): Promise<Category[]>;
  abstract addTask(task: NewTask): Promise<Task>;
  abstract updateTask(task: Task): Promise<Task>;
  abstract deleteTask(id: string): Promise<void>;
  abstract toggleCloudSync(): Promise<{ tasks: Task[]; syncFailed: boolean }>;
}
