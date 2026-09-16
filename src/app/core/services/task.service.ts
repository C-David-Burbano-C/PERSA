import { Injectable, computed, effect, signal } from '@angular/core';
import { ChecklistItem, Task, TaskDraft } from '../models';
import { createId } from '../utils/id.util';
import { addDays, todayIso } from '../utils/date.util';
import { StorageService } from './storage.service';
import { HeartsService } from './hearts.service';

const STORAGE_KEY = 'tasks';

const HEARTS_BY_PRIORITY: Record<Task['priority'], number> = { baja: 6, media: 10, alta: 16 };

function seedTasks(): Task[] {
  const today = todayIso();
  const tomorrow = addDays(today, 1);
  const base = (partial: Partial<Task>): Task => ({
    id: createId(),
    title: '',
    description: '',
    date: today,
    priority: 'media',
    category: 'personal',
    status: 'pendiente',
    progress: 0,
    checklist: [],
    createdAt: new Date().toISOString(),
    ...partial,
  });

  return [
    base({
      title: 'Estudiar para el examen',
      description: 'Repasar los temas de la unidad 3 y hacer un resumen corto.',
      date: today,
      time: '16:00',
      priority: 'alta',
      category: 'estudios',
      progress: 80,
      checklist: [
        { id: createId(), label: 'Leer apuntes', done: true },
        { id: createId(), label: 'Hacer resumen', done: true },
        { id: createId(), label: 'Repasar en voz alta', done: false },
      ],
    }),
    base({
      title: 'Organizar la habitación',
      description: 'Ordenar el clóset y dejar espacio libre en el escritorio.',
      date: today,
      time: '18:30',
      priority: 'media',
      category: 'casa',
      progress: 30,
    }),
    base({
      title: 'Terminar el proyecto',
      description: 'Avanzar la última parte y revisar que todo quede bien.',
      date: today,
      priority: 'alta',
      category: 'trabajo',
      progress: 55,
    }),
    base({
      title: 'Rutina de bienestar',
      description: 'Un ratito para ti: estirar, respirar y tomar agua.',
      date: today,
      priority: 'baja',
      category: 'bienestar',
      status: 'completada',
      progress: 100,
      completedAt: new Date().toISOString(),
    }),
    base({
      title: 'Planear la cita del fin de semana',
      description: 'Pensar juntos a dónde ir y a qué hora.',
      date: tomorrow,
      priority: 'media',
      category: 'nosotros',
    }),
    base({
      title: 'Ahorrar para el viaje',
      description: 'Separar un poquito para la meta del viaje juntos.',
      date: addDays(today, 2),
      priority: 'baja',
      category: 'personal',
    }),
  ];
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly state = signal<Task[]>([]);
  readonly tasks = this.state.asReadonly();

  readonly todayTasks = computed(() => {
    const today = todayIso();
    return this.state()
      .filter((t) => t.date === today)
      .sort((a, b) => (a.time ?? '99:99').localeCompare(b.time ?? '99:99'));
  });

  readonly pendingToday = computed(() => this.todayTasks().filter((t) => t.status !== 'completada'));
  readonly completedToday = computed(() => this.todayTasks().filter((t) => t.status === 'completada'));

  readonly todayProgress = computed(() => {
    const all = this.todayTasks();
    if (!all.length) return 0;
    return Math.round((this.completedToday().length / all.length) * 100);
  });

  readonly nextUpcoming = computed(() => {
    const today = todayIso();
    return this.state()
      .filter((t) => t.status !== 'completada' && t.date >= today)
      .sort((a, b) => (a.date + (a.time ?? '99:99')).localeCompare(b.date + (b.time ?? '99:99')))[0];
  });

  readonly totalCompleted = computed(() => this.state().filter((t) => t.status === 'completada').length);
  readonly totalPending = computed(() => this.state().filter((t) => t.status !== 'completada').length);

  /** Fechas (YYYY-MM-DD) que tienen al menos una tarea completada — para la racha y los puntos del calendario. */
  readonly completedDates = computed(
    () => new Set(this.state().filter((t) => t.status === 'completada').map((t) => t.date)),
  );

  constructor(
    private readonly storage: StorageService,
    private readonly hearts: HeartsService,
  ) {
    const stored = this.storage.read<Task[] | null>(STORAGE_KEY, null);
    this.state.set(stored === null ? seedTasks() : stored);

    effect(() => {
      this.storage.write(STORAGE_KEY, this.state());
    });
  }

  tasksForDate(iso: string): Task[] {
    return this.state()
      .filter((t) => t.date === iso)
      .sort((a, b) => (a.time ?? '99:99').localeCompare(b.time ?? '99:99'));
  }

  tasksForRange(startIso: string, endIso: string): Task[] {
    return this.state().filter((t) => t.date >= startIso && t.date <= endIso);
  }

  getById(id: string): Task | undefined {
    return this.state().find((t) => t.id === id);
  }

  add(draft: TaskDraft): Task {
    const task: Task = {
      ...draft,
      id: createId(),
      status: 'pendiente',
      progress: draft.progress ?? 0,
      createdAt: new Date().toISOString(),
    };
    this.state.update((tasks) => [...tasks, task]);
    return task;
  }

  update(id: string, changes: Partial<TaskDraft>): void {
    this.state.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }

  remove(id: string): void {
    this.state.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  moveToDate(id: string, date: string): void {
    this.state.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, date } : t)));
  }

  toggleChecklistItem(taskId: string, itemId: string): void {
    this.state.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const checklist: ChecklistItem[] = t.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c));
        const progress = checklist.length
          ? Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100)
          : t.progress;
        return { ...t, checklist, progress };
      }),
    );
  }

  /** Marca la tarea como completada o no, y suma o devuelve los corazones según toque. */
  toggleComplete(id: string): void {
    const task = this.getById(id);
    if (!task) return;

    if (task.status === 'completada') {
      this.hearts.spend(HEARTS_BY_PRIORITY[task.priority]);
      this.state.update((tasks) =>
        tasks.map((t) => (t.id === id ? { ...t, status: 'pendiente', completedAt: undefined } : t)),
      );
      return;
    }

    this.hearts.earn(HEARTS_BY_PRIORITY[task.priority]);
    this.state.update((tasks) =>
      tasks.map((t) =>
        t.id === id ? { ...t, status: 'completada', progress: 100, completedAt: new Date().toISOString() } : t,
      ),
    );
  }

  /** Borra todas las tareas — se usa para limpiar los datos de ejemplo. */
  clearAll(): void {
    this.state.set([]);
  }
}
