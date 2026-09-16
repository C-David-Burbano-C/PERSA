import { CategoryId } from './category.model';

export interface GoalStep {
  id: string;
  label: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: CategoryId;
  steps: GoalStep[];
  createdAt: string;
}

export type GoalDraft = Omit<Goal, 'id' | 'createdAt' | 'steps'> & { steps: Omit<GoalStep, 'id'>[] };
