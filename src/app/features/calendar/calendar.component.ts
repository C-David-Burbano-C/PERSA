import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CelebrationService, TaskService } from '../../core/services';
import { Task, TaskDraft, categoryMeta } from '../../core/models';
import {
  addDays,
  buildMonthGrid,
  formatLong,
  fromIso,
  monthLabel,
  todayIso,
  weekDates,
} from '../../core/utils/date.util';
import { TaskModalComponent } from '../../shared/components/task-modal/task-modal.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PriorityBadgeComponent } from '../../shared/components/priority-badge/priority-badge.component';

type ViewMode = 'mes' | 'semana';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [TaskModalComponent, ConfirmDialogComponent, EmptyStateComponent, IconComponent, PriorityBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-display text-2xl text-lilac-950 sm:text-3xl">Calendario</h1>
          <p class="mt-1 text-sm text-lilac-500">Mira tus días de un vistazo.</p>
        </div>
        <div class="flex rounded-xl bg-lilac-100 p-1">
          @for (mode of viewModes; track mode) {
            <button
              type="button"
              (click)="viewMode.set(mode)"
              class="rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-colors"
              [class]="viewMode() === mode ? 'bg-white text-lilac-700 shadow-soft' : 'text-lilac-500'"
            >
              {{ mode }}
            </button>
          }
        </div>
      </div>

      <div class="card-surface rounded-2xl p-4 sm:p-6">
        <div class="mb-4 flex items-center justify-between">
          <button type="button" (click)="shift(-1)" class="rounded-lg p-2 text-lilac-500 hover:bg-lilac-50" aria-label="Anterior">
            <app-icon name="chevron-left" [size]="18" />
          </button>
          <p class="text-sm font-semibold capitalize text-lilac-900 sm:text-base">
            {{ viewMode() === 'mes' ? monthTitle() : weekTitle() }}
          </p>
          <button type="button" (click)="shift(1)" class="rounded-lg p-2 text-lilac-500 hover:bg-lilac-50" aria-label="Siguiente">
            <app-icon name="chevron-right" [size]="18" />
          </button>
        </div>

        @if (viewMode() === 'mes') {
          <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-lilac-400 sm:gap-1.5">
            @for (d of weekdayLabels; track d) {
              <div class="py-1">{{ d }}</div>
            }
          </div>
          <div class="grid grid-cols-7 gap-1 sm:gap-1.5">
            @for (day of monthGrid(); track day) {
              <button
                type="button"
                (click)="selectDate(day)"
                (dragover)="$event.preventDefault()"
                (drop)="onDrop(day)"
                class="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-xs transition-colors sm:text-sm"
                [class]="dayClasses(day)"
              >
                <span>{{ dayNumber(day) }}</span>
                @if (dotsFor(day).length) {
                  <span class="flex items-center gap-0.5">
                    @for (dot of dotsFor(day); track $index) {
                      <span class="h-1 w-1 rounded-full" [class]="dot"></span>
                    }
                  </span>
                }
              </button>
            }
          </div>
        } @else {
          <div class="grid grid-cols-7 gap-1.5">
            @for (day of weekGrid(); track day) {
              <button
                type="button"
                (click)="selectDate(day)"
                (dragover)="$event.preventDefault()"
                (drop)="onDrop(day)"
                class="flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-xs transition-colors"
                [class]="dayClasses(day)"
              >
                <span class="text-[10px] uppercase opacity-70">{{ weekdayLabels[fromIsoDay(day)] }}</span>
                <span class="text-base font-semibold">{{ dayNumber(day) }}</span>
                @if (dotsFor(day).length) {
                  <span class="flex items-center gap-0.5">
                    @for (dot of dotsFor(day); track $index) {
                      <span class="h-1 w-1 rounded-full" [class]="dot"></span>
                    }
                  </span>
                }
              </button>
            }
          </div>
        }
      </div>

      <section>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-base font-semibold text-lilac-900">{{ selectedTitle() }}</h2>
          <button type="button" (click)="openNewTask()" class="text-sm font-medium text-lilac-600 hover:underline">+ Nueva actividad</button>
        </div>

        @if (dayTasks().length) {
          <div class="space-y-2.5">
            @for (task of dayTasks(); track task.id) {
              <div
                draggable="true"
                (dragstart)="onDragStart($event, task)"
                class="card-surface flex cursor-grab items-center gap-3 rounded-xl p-3.5 transition-transform active:cursor-grabbing sm:p-4"
              >
                <button
                  type="button"
                  (click)="onToggle(task)"
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"
                  [class]="task.status === 'completada' ? 'border-lilac-600 bg-lilac-600 text-white' : 'border-lilac-300 text-transparent'"
                >
                  <app-icon name="check" [size]="13" [strokeWidth]="2.6" />
                </button>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-lilac-900" [class.line-through]="task.status === 'completada'">
                    {{ task.title }}
                  </p>
                  <div class="mt-1 flex items-center gap-2 text-xs text-lilac-400">
                    @if (task.time) {
                      <span>{{ task.time }}</span>
                    }
                    <app-priority-badge [priority]="task.priority" />
                  </div>
                </div>
                <button type="button" (click)="openEdit(task)" class="shrink-0 rounded-lg p-1.5 text-lilac-400 hover:bg-lilac-100 hover:text-lilac-700">
                  <app-icon name="pencil" [size]="14" />
                </button>
                <button type="button" (click)="askDelete(task)" class="shrink-0 rounded-lg p-1.5 text-lilac-400 hover:bg-rose-50 hover:text-rose-500">
                  <app-icon name="trash" [size]="14" />
                </button>
              </div>
            }
          </div>
        } @else {
          <app-empty-state icon="calendar" title="Sin actividades este día" subtitle="Arrastra una tarjeta aquí o crea una nueva." />
        }
      </section>
    </div>

    <app-task-modal [open]="modalOpen()" [task]="editingTask()" [defaultDate]="selectedDate()" (close)="closeModal()" (save)="onSave($event)" />

    <app-confirm-dialog
      [open]="taskToDelete() !== null"
      title="¿Eliminar esta actividad?"
      message="Se quitará de tu calendario para siempre."
      (cancel)="taskToDelete.set(null)"
      (confirm)="confirmDelete()"
    />
  `,
})
export class CalendarComponent {
  protected readonly taskService = inject(TaskService);
  private readonly celebration = inject(CelebrationService);

  readonly viewModes: ViewMode[] = ['mes', 'semana'];
  readonly viewMode = signal<ViewMode>('mes');
  readonly weekdayLabels = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

  readonly referenceDate = signal(new Date());
  readonly selectedDate = signal(todayIso());

  readonly modalOpen = signal(false);
  readonly editingTask = signal<Task | null>(null);
  readonly taskToDelete = signal<Task | null>(null);
  private draggingTaskId: string | null = null;

  readonly monthGrid = computed(() => buildMonthGrid(this.referenceDate()));
  readonly weekGrid = computed(() => weekDates(this.selectedDate()));
  readonly monthTitle = computed(() => monthLabel(this.referenceDate()));
  readonly weekTitle = computed(() => {
    const dates = this.weekGrid();
    return `${formatLong(dates[0])} — ${formatLong(dates[6])}`;
  });

  readonly dayTasks = computed(() => this.taskService.tasksForDate(this.selectedDate()));
  readonly selectedTitle = computed(() => formatLong(this.selectedDate()));

  fromIsoDay(iso: string): number {
    return fromIso(iso).getDay();
  }

  dayNumber(iso: string): number {
    return fromIso(iso).getDate();
  }

  dotsFor(iso: string): string[] {
    return this.taskService
      .tasksForDate(iso)
      .slice(0, 3)
      .map((t) => categoryMeta(t.category).dot);
  }

  dayClasses(iso: string): string {
    const isToday = iso === todayIso();
    const isSelected = iso === this.selectedDate();
    const inMonth = this.viewMode() === 'semana' || fromIso(iso).getMonth() === this.referenceDate().getMonth();

    if (isSelected) return 'bg-lilac-600 text-white shadow-soft';
    if (isToday) return 'bg-lilac-100 text-lilac-700 font-semibold ring-1 ring-lilac-300';
    if (!inMonth) return 'text-lilac-300 hover:bg-lilac-50';
    return 'text-lilac-700 hover:bg-lilac-50';
  }

  selectDate(iso: string): void {
    this.selectedDate.set(iso);
  }

  shift(amount: number): void {
    if (this.viewMode() === 'mes') {
      const ref = this.referenceDate();
      this.referenceDate.set(new Date(ref.getFullYear(), ref.getMonth() + amount, 1));
    } else {
      this.selectedDate.set(addDays(this.selectedDate(), amount * 7));
    }
  }

  onDragStart(event: DragEvent, task: Task): void {
    this.draggingTaskId = task.id;
    event.dataTransfer?.setData('text/plain', task.id);
  }

  onDrop(day: string): void {
    if (!this.draggingTaskId) return;
    this.taskService.moveToDate(this.draggingTaskId, day);
    this.draggingTaskId = null;
    this.selectedDate.set(day);
  }

  openNewTask(): void {
    this.editingTask.set(null);
    this.modalOpen.set(true);
  }

  openEdit(task: Task): void {
    this.editingTask.set(task);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  onToggle(task: Task): void {
    const wasCompleted = task.status === 'completada';
    this.taskService.toggleComplete(task.id);
    if (!wasCompleted) this.celebration.celebrate();
  }

  askDelete(task: Task): void {
    this.taskToDelete.set(task);
  }

  confirmDelete(): void {
    const task = this.taskToDelete();
    if (task) this.taskService.remove(task.id);
    this.taskToDelete.set(null);
  }

  onSave(event: { id?: string; draft: TaskDraft }): void {
    if (event.id) {
      this.taskService.update(event.id, event.draft);
    } else {
      this.taskService.add(event.draft);
    }
    this.closeModal();
  }
}
