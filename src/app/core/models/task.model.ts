import { CategoryId } from './category.model';
import { Priority } from './priority.model';

export type TaskStatus = 'pendiente' | 'en-progreso' | 'completada';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  /** Fecha en formato YYYY-MM-DD */
  date: string;
  /** Hora HH:mm, es opcional */
  time?: string;
  priority: Priority;
  category: CategoryId;
  status: TaskStatus;
  /** De 0 a 100. Si hay checklist sale de ahí, si no es manual */
  progress: number;
  checklist: ChecklistItem[];
  rewardId?: string;
  goalId?: string;
  createdAt: string;
  completedAt?: string;
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'status' | 'progress'> & {
  progress?: number;
};
