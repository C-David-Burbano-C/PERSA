import { Injectable, computed, effect, signal } from '@angular/core';
import { Goal, GoalDraft, GoalStep } from '../models';
import { createId } from '../utils/id.util';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'goals';

function seedGoals(): Goal[] {
  return [
    {
      id: createId(),
      title: 'Viajar juntos',
      description: 'Esa escapada que llevamos tiempo planeando.',
      icon: 'plane',
      category: 'nosotros',
      createdAt: new Date().toISOString(),
      steps: [
        { id: createId(), label: 'Ahorrar la primera parte', done: true },
        { id: createId(), label: 'Buscar lugares', done: true },
        { id: createId(), label: 'Elegir fecha', done: false },
        { id: createId(), label: 'Planear alojamiento', done: false },
      ],
    },
    {
      id: createId(),
      title: 'Cuidar más de mí',
      description: 'Pequeños hábitos para sentirme mejor cada día.',
      icon: 'flower',
      category: 'bienestar',
      createdAt: new Date().toISOString(),
      steps: [
        { id: createId(), label: 'Tomar más agua', done: true },
        { id: createId(), label: 'Dormir mejor', done: false },
        { id: createId(), label: 'Un ratito de calma al día', done: false },
      ],
    },
    {
      id: createId(),
      title: 'Terminar el semestre bien',
      description: 'Llegar tranquila hasta el final.',
      icon: 'book-open',
      category: 'estudios',
      createdAt: new Date().toISOString(),
      steps: [
        { id: createId(), label: 'Ponerse al día con pendientes', done: true },
        { id: createId(), label: 'Organizar un horario de estudio', done: false },
      ],
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class GoalService {
  private readonly state = signal<Goal[]>([]);
  readonly goals = this.state.asReadonly();

  readonly withProgress = computed(() =>
    this.state().map((goal) => ({ goal, progress: this.progressOf(goal) })),
  );

  readonly achievedCount = computed(() => this.state().filter((g) => this.progressOf(g) === 100).length);

  constructor(private readonly storage: StorageService) {
    const stored = this.storage.read<Goal[] | null>(STORAGE_KEY, null);
    this.state.set(stored === null ? seedGoals() : stored);

    effect(() => {
      this.storage.write(STORAGE_KEY, this.state());
    });
  }

  progressOf(goal: Goal): number {
    if (!goal.steps.length) return 0;
    return Math.round((goal.steps.filter((s) => s.done).length / goal.steps.length) * 100);
  }

  getById(id: string): Goal | undefined {
    return this.state().find((g) => g.id === id);
  }

  add(draft: GoalDraft): Goal {
    const goal: Goal = {
      ...draft,
      id: createId(),
      createdAt: new Date().toISOString(),
      steps: draft.steps.map((s): GoalStep => ({ ...s, id: createId() })),
    };
    this.state.update((goals) => [...goals, goal]);
    return goal;
  }

  update(id: string, changes: Partial<Omit<Goal, 'id' | 'steps' | 'createdAt'>>): void {
    this.state.update((goals) => goals.map((g) => (g.id === id ? { ...g, ...changes } : g)));
  }

  remove(id: string): void {
    this.state.update((goals) => goals.filter((g) => g.id !== id));
  }

  toggleStep(goalId: string, stepId: string): void {
    this.state.update((goals) =>
      goals.map((g) =>
        g.id === goalId
          ? { ...g, steps: g.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)) }
          : g,
      ),
    );
  }

  addStep(goalId: string, label: string): void {
    if (!label.trim()) return;
    this.state.update((goals) =>
      goals.map((g) =>
        g.id === goalId ? { ...g, steps: [...g.steps, { id: createId(), label: label.trim(), done: false }] } : g,
      ),
    );
  }

  updateStep(goalId: string, stepId: string, label: string): void {
    if (!label.trim()) return;
    this.state.update((goals) =>
      goals.map((g) =>
        g.id === goalId ? { ...g, steps: g.steps.map((s) => (s.id === stepId ? { ...s, label: label.trim() } : s)) } : g,
      ),
    );
  }

  removeStep(goalId: string, stepId: string): void {
    this.state.update((goals) =>
      goals.map((g) => (g.id === goalId ? { ...g, steps: g.steps.filter((s) => s.id !== stepId) } : g)),
    );
  }

  /** Borra todas las metas — se usa para limpiar los datos de ejemplo. */
  clearAll(): void {
    this.state.set([]);
  }
}
