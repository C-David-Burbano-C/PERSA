import { Injectable, computed, effect, signal } from '@angular/core';
import { StorageService } from './storage.service';

interface HeartsState {
  balance: number;
  lifetimeEarned: number;
}

const STORAGE_KEY = 'hearts';
const INITIAL_STATE: HeartsState = { balance: 120, lifetimeEarned: 120 };

/**
 * Lleva la cuenta de los corazones, que es como la "moneda" de las recompensas.
 * Lo separo de TaskService y RewardService para que ninguno dependa del otro,
 * solo necesitan sumar o gastar corazones.
 */
@Injectable({ providedIn: 'root' })
export class HeartsService {
  private readonly state = signal<HeartsState>(INITIAL_STATE);

  readonly balance = computed(() => this.state().balance);
  readonly lifetimeEarned = computed(() => this.state().lifetimeEarned);

  constructor(private readonly storage: StorageService) {
    this.state.set(this.storage.read(STORAGE_KEY, INITIAL_STATE));

    effect(() => {
      this.storage.write(STORAGE_KEY, this.state());
    });
  }

  earn(amount: number): void {
    if (amount <= 0) return;
    this.state.update((s) => ({ balance: s.balance + amount, lifetimeEarned: s.lifetimeEarned + amount }));
  }

  /** Devuelve true si alcanzaron los corazones para gastar. */
  spend(amount: number): boolean {
    if (amount <= 0) return true;
    let ok = false;
    this.state.update((s) => {
      if (s.balance < amount) {
        ok = false;
        return s;
      }
      ok = true;
      return { ...s, balance: s.balance - amount };
    });
    return ok;
  }

  refund(amount: number): void {
    if (amount <= 0) return;
    this.state.update((s) => ({ ...s, balance: s.balance + amount }));
  }

  /** Deja los corazones en cero — se usa para limpiar los datos de ejemplo. */
  reset(): void {
    this.state.set({ balance: 0, lifetimeEarned: 0 });
  }
}
