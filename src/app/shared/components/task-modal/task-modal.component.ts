import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CATEGORIES, ChecklistItem, Priority, Task, TaskDraft } from '../../../core/models';
import { createId } from '../../../core/utils/id.util';
import { todayIso } from '../../../core/utils/date.util';
import { GoalService, RewardService } from '../../../core/services';
import { IconComponent } from '../icon/icon.component';

interface TaskFormState {
  title: string;
  description: string;
  date: string;
  time: string;
  priority: Priority;
  category: TaskDraft['category'];
  checklist: ChecklistItem[];
  rewardId: string;
  goalId: string;
}

function blankState(defaultDate?: string): TaskFormState {
  return {
    title: '',
    description: '',
    date: defaultDate ?? todayIso(),
    time: '',
    priority: 'media',
    category: 'personal',
    checklist: [],
    rewardId: '',
    goalId: '',
  };
}

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div class="absolute inset-0 bg-lilac-950/30 backdrop-blur-sm" (click)="close.emit()"></div>

        <div class="animate-pop relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-soft-lg sm:rounded-3xl">
          <header class="flex shrink-0 items-center justify-between border-b border-lilac-100 px-5 py-4 sm:px-6">
            <h2 class="text-base font-semibold text-lilac-950 sm:text-lg">{{ task() ? 'Editar actividad' : 'Nueva actividad' }}</h2>
            <button type="button" (click)="close.emit()" class="rounded-lg p-1.5 text-lilac-400 hover:bg-lilac-50 hover:text-lilac-700" aria-label="Cerrar">
              <app-icon name="x" [size]="18" />
            </button>
          </header>

          <div class="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Nombre de la actividad</label>
              <input
                type="text"
                [(ngModel)]="form.title"
                placeholder="Ej. Estudiar para el examen"
                class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none transition-colors placeholder:text-lilac-300 focus:border-lilac-400 focus:bg-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Descripción</label>
              <textarea
                [(ngModel)]="form.description"
                rows="2"
                placeholder="Un poco más de detalle (opcional)"
                class="w-full resize-none rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none transition-colors placeholder:text-lilac-300 focus:border-lilac-400 focus:bg-white"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1.5 block text-xs font-medium text-lilac-500">Fecha</label>
                <input
                  type="date"
                  [(ngModel)]="form.date"
                  class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-medium text-lilac-500">Hora (opcional)</label>
                <input
                  type="time"
                  [(ngModel)]="form.time"
                  class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Prioridad</label>
              <div class="grid grid-cols-3 gap-2">
                @for (p of priorities; track p) {
                  <button
                    type="button"
                    (click)="form.priority = p"
                    class="rounded-xl border px-2 py-2 text-xs font-medium capitalize transition-colors"
                    [class]="form.priority === p ? 'border-lilac-500 bg-lilac-600 text-white' : 'border-lilac-200 text-lilac-500 hover:bg-lilac-50'"
                  >
                    {{ p }}
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Categoría</label>
              <div class="flex flex-wrap gap-2">
                @for (c of categories; track c.id) {
                  <button
                    type="button"
                    (click)="form.category = c.id"
                    class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                    [class]="form.category === c.id ? 'border-transparent bg-lilac-600 text-white' : 'border-lilac-200 text-lilac-500 hover:bg-lilac-50'"
                  >
                    <app-icon [name]="c.icon" [size]="12" />
                    {{ c.label }}
                  </button>
                }
              </div>
            </div>

            <div>
              <div class="mb-1.5 flex items-center justify-between">
                <label class="block text-xs font-medium text-lilac-500">Checklist (opcional)</label>
                <button type="button" (click)="addChecklistItem()" class="text-xs font-medium text-lilac-600 hover:underline">
                  + Añadir paso
                </button>
              </div>
              <div class="space-y-2">
                @for (item of form.checklist; track item.id) {
                  <div class="flex items-center gap-2">
                    <input
                      type="text"
                      [(ngModel)]="item.label"
                      [ngModelOptions]="{ standalone: true }"
                      placeholder="Paso del checklist"
                      class="flex-1 rounded-lg border border-lilac-200 bg-lilac-50/50 px-3 py-1.5 text-xs text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
                    />
                    <button type="button" (click)="removeChecklistItem(item.id)" class="shrink-0 rounded-lg p-1.5 text-lilac-400 hover:bg-rose-50 hover:text-rose-500">
                      <app-icon name="x" [size]="14" />
                    </button>
                  </div>
                }
              </div>
            </div>

            @if (rewards().length) {
              <div>
                <label class="mb-1.5 block text-xs font-medium text-lilac-500">Recompensa asociada (opcional)</label>
                <select
                  [(ngModel)]="form.rewardId"
                  class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
                >
                  <option value="">Ninguna</option>
                  @for (r of rewards(); track r.id) {
                    <option [value]="r.id">{{ r.title }}</option>
                  }
                </select>
              </div>
            }

            @if (goals().length) {
              <div>
                <label class="mb-1.5 block text-xs font-medium text-lilac-500">Meta relacionada (opcional)</label>
                <select
                  [(ngModel)]="form.goalId"
                  class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
                >
                  <option value="">Ninguna</option>
                  @for (g of goals(); track g.id) {
                    <option [value]="g.id">{{ g.title }}</option>
                  }
                </select>
              </div>
            }
          </div>

          <footer class="flex shrink-0 items-center justify-end gap-2 border-t border-lilac-100 px-5 py-4 sm:px-6">
            <button type="button" (click)="close.emit()" class="rounded-xl px-4 py-2.5 text-sm font-medium text-lilac-600 hover:bg-lilac-50">
              Cancelar
            </button>
            <button
              type="button"
              [disabled]="!form.title.trim()"
              (click)="submit()"
              class="rounded-xl bg-lilac-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-lilac-700 disabled:cursor-not-allowed disabled:bg-lilac-200"
            >
              {{ task() ? 'Guardar cambios' : 'Crear actividad' }}
            </button>
          </footer>
        </div>
      </div>
    }
  `,
})
export class TaskModalComponent {
  private readonly rewardService = inject(RewardService);
  private readonly goalService = inject(GoalService);

  readonly open = input<boolean>(false);
  readonly task = input<Task | null>(null);
  readonly defaultDate = input<string | undefined>(undefined);

  readonly close = output<void>();
  readonly save = output<{ id?: string; draft: TaskDraft }>();

  readonly priorities: Priority[] = ['baja', 'media', 'alta'];
  readonly categories = CATEGORIES;
  readonly rewards = this.rewardService.rewards;
  readonly goals = this.goalService.goals;

  form: TaskFormState = blankState();

  constructor() {
    effect(() => {
      const task = this.task();
      const isOpen = this.open();
      if (!isOpen) return;
      this.form = task
        ? {
            title: task.title,
            description: task.description,
            date: task.date,
            time: task.time ?? '',
            priority: task.priority,
            category: task.category,
            checklist: task.checklist.map((c) => ({ ...c })),
            rewardId: task.rewardId ?? '',
            goalId: task.goalId ?? '',
          }
        : blankState(this.defaultDate());
    });
  }

  addChecklistItem(): void {
    this.form.checklist = [...this.form.checklist, { id: createId(), label: '', done: false }];
  }

  removeChecklistItem(id: string): void {
    this.form.checklist = this.form.checklist.filter((c) => c.id !== id);
  }

  submit(): void {
    if (!this.form.title.trim()) return;
    const draft: TaskDraft = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      date: this.form.date || todayIso(),
      time: this.form.time || undefined,
      priority: this.form.priority,
      category: this.form.category,
      checklist: this.form.checklist.filter((c) => c.label.trim()),
      rewardId: this.form.rewardId || undefined,
      goalId: this.form.goalId || undefined,
    };
    this.save.emit({ id: this.task()?.id, draft });
  }
}
