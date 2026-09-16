export interface CoupleMemory {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  createdAt: string;
}

export type CoupleMemoryDraft = Omit<CoupleMemory, 'id' | 'createdAt'>;

export interface CouplePlan {
  id: string;
  title: string;
  icon: string;
  done: boolean;
  createdAt: string;
}

export type CouplePlanDraft = Omit<CouplePlan, 'id' | 'done' | 'createdAt'>;
