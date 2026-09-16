import { Injectable, computed, effect, signal } from '@angular/core';
import { CoupleMemory, CoupleMemoryDraft, CouplePlan, CouplePlanDraft } from '../models';
import { createId } from '../utils/id.util';
import { addDays, todayIso } from '../utils/date.util';
import { StorageService } from './storage.service';

const MEMORIES_KEY = 'couple-memories';
const PLANS_KEY = 'couple-plans';

function seedMemories(): CoupleMemory[] {
  const today = todayIso();
  return [
    {
      id: createId(),
      title: 'Nuestra primera cita',
      description: 'Todavía recuerdo lo nerviosos que estábamos.',
      date: addDays(today, -120),
      createdAt: new Date().toISOString(),
    },
    {
      id: createId(),
      title: 'Esa tarde de lluvia',
      description: 'Nos quedamos viendo películas todo el día.',
      date: addDays(today, -30),
      createdAt: new Date().toISOString(),
    },
  ];
}

function seedPlans(): CouplePlan[] {
  const now = new Date().toISOString();
  return [
    { id: createId(), title: 'Tener una cita', icon: 'rose', done: false, createdAt: now },
    { id: createId(), title: 'Ver una película', icon: 'clapperboard', done: false, createdAt: now },
    { id: createId(), title: 'Comer algo juntos', icon: 'pizza', done: false, createdAt: now },
    { id: createId(), title: 'Tomarnos fotos', icon: 'camera', done: false, createdAt: now },
    { id: createId(), title: 'Hacer una pequeña salida', icon: 'mountain', done: false, createdAt: now },
  ];
}

@Injectable({ providedIn: 'root' })
export class MemoryService {
  private readonly memoriesState = signal<CoupleMemory[]>([]);
  private readonly plansState = signal<CouplePlan[]>([]);

  readonly memories = computed(() => [...this.memoriesState()].sort((a, b) => (a.date < b.date ? 1 : -1)));
  readonly plans = this.plansState.asReadonly();
  readonly pendingPlans = computed(() => this.plansState().filter((p) => !p.done));

  constructor(private readonly storage: StorageService) {
    const storedMemories = this.storage.read<CoupleMemory[] | null>(MEMORIES_KEY, null);
    this.memoriesState.set(storedMemories === null ? seedMemories() : storedMemories);

    const storedPlans = this.storage.read<CouplePlan[] | null>(PLANS_KEY, null);
    this.plansState.set(storedPlans === null ? seedPlans() : storedPlans);

    effect(() => this.storage.write(MEMORIES_KEY, this.memoriesState()));
    effect(() => this.storage.write(PLANS_KEY, this.plansState()));
  }

  addMemory(draft: CoupleMemoryDraft): void {
    const memory: CoupleMemory = { ...draft, id: createId(), createdAt: new Date().toISOString() };
    this.memoriesState.update((memories) => [...memories, memory]);
  }

  updateMemory(id: string, changes: Partial<CoupleMemoryDraft>): void {
    this.memoriesState.update((memories) => memories.map((m) => (m.id === id ? { ...m, ...changes } : m)));
  }

  removeMemory(id: string): void {
    this.memoriesState.update((memories) => memories.filter((m) => m.id !== id));
  }

  addPlan(draft: CouplePlanDraft): void {
    const plan: CouplePlan = { ...draft, id: createId(), done: false, createdAt: new Date().toISOString() };
    this.plansState.update((plans) => [...plans, plan]);
  }

  togglePlan(id: string): void {
    this.plansState.update((plans) => plans.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));
  }

  removePlan(id: string): void {
    this.plansState.update((plans) => plans.filter((p) => p.id !== id));
  }

  /** Borra recuerdos y planes — se usa para limpiar los datos de ejemplo. */
  clearAll(): void {
    this.memoriesState.set([]);
    this.plansState.set([]);
  }
}
