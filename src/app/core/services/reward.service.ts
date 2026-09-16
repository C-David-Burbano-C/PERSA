import { Injectable, computed, effect, signal } from '@angular/core';
import { Reward, RewardDraft } from '../models';
import { createId } from '../utils/id.util';
import { StorageService } from './storage.service';
import { HeartsService } from './hearts.service';

const STORAGE_KEY = 'rewards';

function seedRewards(): Reward[] {
  const now = new Date().toISOString();
  const base = (partial: Partial<Reward>): Reward => ({
    id: createId(),
    title: '',
    description: '',
    icon: 'gift',
    requiredPoints: 50,
    unlocked: false,
    redeemed: false,
    createdAt: now,
    ...partial,
  });

  return [
    base({ title: 'Escoger la película que veremos juntos', description: 'Tú decides qué vemos esta vez.', icon: 'clapperboard', requiredPoints: 40 }),
    base({ title: 'Un helado conmigo', description: 'Del sabor que tú quieras.', icon: 'ice-cream', requiredPoints: 60 }),
    base({ title: 'Un mensaje especial', description: 'Algo escrito solo para ti.', icon: 'mail-heart', requiredPoints: 30 }),
    base({ title: 'Una cita sorpresa', description: 'Yo me encargo de todo.', icon: 'sparkles', requiredPoints: 150 }),
    base({ title: 'Un abrazo de los que duran mucho', description: 'De esos que no quieres soltar.', icon: 'hand-heart', requiredPoints: 20 }),
  ];
}

@Injectable({ providedIn: 'root' })
export class RewardService {
  private readonly state = signal<Reward[]>([]);

  /** Recompensas con el estado "desbloqueada" calculado en vivo según los corazones que hay. */
  readonly rewards = computed(() => {
    const balance = this.hearts.balance();
    return this.state().map((r) => ({ ...r, unlocked: r.redeemed || balance >= r.requiredPoints }));
  });

  readonly unlockedCount = computed(() => this.rewards().filter((r) => r.unlocked).length);
  readonly redeemedCount = computed(() => this.state().filter((r) => r.redeemed).length);

  constructor(
    private readonly storage: StorageService,
    private readonly hearts: HeartsService,
  ) {
    const stored = this.storage.read<Reward[] | null>(STORAGE_KEY, null);
    this.state.set(stored === null ? seedRewards() : stored);

    effect(() => {
      this.storage.write(STORAGE_KEY, this.state());
    });
  }

  add(draft: RewardDraft): Reward {
    const reward: Reward = { ...draft, id: createId(), unlocked: false, redeemed: false, createdAt: new Date().toISOString() };
    this.state.update((rewards) => [...rewards, reward]);
    return reward;
  }

  update(id: string, changes: Partial<RewardDraft>): void {
    this.state.update((rewards) => rewards.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  }

  remove(id: string): void {
    this.state.update((rewards) => rewards.filter((r) => r.id !== id));
  }

  /** Gasta los corazones y marca la recompensa como canjeada. Devuelve si se pudo hacer. */
  redeem(id: string): boolean {
    const reward = this.state().find((r) => r.id === id);
    if (!reward || reward.redeemed) return false;
    if (!this.hearts.spend(reward.requiredPoints)) return false;
    this.state.update((rewards) => rewards.map((r) => (r.id === id ? { ...r, redeemed: true } : r)));
    return true;
  }

  /** Deshace un canje y devuelve los corazones gastados. */
  unredeem(id: string): void {
    const reward = this.state().find((r) => r.id === id);
    if (!reward || !reward.redeemed) return;
    this.hearts.refund(reward.requiredPoints);
    this.state.update((rewards) => rewards.map((r) => (r.id === id ? { ...r, redeemed: false } : r)));
  }

  /** Borra todas las recompensas — se usa para limpiar los datos de ejemplo. */
  clearAll(): void {
    this.state.set([]);
  }
}
