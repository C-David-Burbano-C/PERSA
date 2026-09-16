export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredPoints: number;
  unlocked: boolean;
  redeemed: boolean;
  createdAt: string;
}

export type RewardDraft = Omit<Reward, 'id' | 'unlocked' | 'redeemed' | 'createdAt'>;
