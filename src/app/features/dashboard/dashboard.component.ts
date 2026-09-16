import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CelebrationService, GoalService, RewardService, StatsService, TaskService } from '../../core/services';
import { DailyMessageComponent } from '../../shared/components/daily-message/daily-message.component';
import { TaskCardComponent } from '../../shared/components/task-card/task-card.component';
import { ProgressCardComponent } from '../../shared/components/progress-card/progress-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TaskModalComponent } from '../../shared/components/task-modal/task-modal.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Task, TaskDraft } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    DailyMessageComponent,
    TaskCardComponent,
    ProgressCardComponent,
    EmptyStateComponent,
    TaskModalComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 class="font-display text-2xl text-lilac-950 sm:text-3xl">Hola, amor</h1>
        <p class="mt-1 text-sm text-lilac-500">Aquí está un pequeño resumen de tu día.</p>
      </div>

      <app-daily-message />

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <app-progress-card icon="check-square" [value]="tasks.pendingToday().length" label="Pendientes hoy" />
        <app-progress-card icon="check" [value]="tasks.completedToday().length" label="Completadas hoy" />
        <app-progress-card icon="flame" [value]="stats.streak()" label="Días seguidos" />
        <app-progress-card icon="heart-fill" [value]="stats.heartsBalance()" label="Corazones" />
      </div>

      <section class="card-surface rounded-2xl p-5 sm:p-6">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-lilac-800">Progreso del día</h2>
          <span class="text-sm font-semibold text-lilac-600">{{ tasks.todayProgress() }}%</span>
        </div>
        <div class="h-2.5 overflow-hidden rounded-full bg-lilac-100">
          <div
            class="h-full rounded-full bg-gradient-to-r from-lilac-400 via-lilac-500 to-blush-400 transition-all duration-700"
            [style.width.%]="tasks.todayProgress()"
          ></div>
        </div>

        @if (tasks.nextUpcoming(); as next) {
          <div class="mt-4 flex items-center gap-2 rounded-xl bg-lilac-50 px-3.5 py-2.5 text-sm text-lilac-600">
            <app-icon name="clock" [size]="15" class="shrink-0 text-lilac-400" />
            <span class="truncate">Próxima actividad: <strong class="font-semibold text-lilac-800">{{ next.title }}</strong></span>
          </div>
        }
      </section>

      <section>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-base font-semibold text-lilac-900">Hoy</h2>
          <div class="flex items-center gap-3">
            <button type="button" (click)="openNewTask()" class="text-sm font-medium text-lilac-600 hover:underline">+ Nueva actividad</button>
            <a routerLink="/tareas" class="text-sm font-medium text-lilac-400 hover:text-lilac-600">Ver todas</a>
          </div>
        </div>

        @if (tasks.todayTasks().length) {
          <div class="grid gap-3 sm:grid-cols-2">
            @for (task of tasks.todayTasks(); track task.id) {
              <app-task-card
                [task]="task"
                (toggleComplete)="onToggle(task)"
                (edit)="openEdit(task)"
                (remove)="tasks.remove(task.id)"
              />
            }
          </div>
        } @else {
          <app-empty-state icon="sparkle" title="Nada por aquí todavía" subtitle="Cuando quieras, agrega una pequeña actividad para hoy.">
            <button type="button" (click)="openNewTask()" class="mt-1 text-sm font-medium text-lilac-600 hover:underline">Agregar actividad</button>
          </app-empty-state>
        }
      </section>

      @if (goals.withProgress().length) {
        <section>
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-semibold text-lilac-900">Cosas que quieres lograr</h2>
            <a routerLink="/metas" class="text-sm font-medium text-lilac-400 hover:text-lilac-600">Ver metas</a>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            @for (item of goals.withProgress().slice(0, 2); track item.goal.id) {
              <a routerLink="/metas" class="card-surface flex items-center gap-3 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lilac-100 text-lilac-600">
                  <app-icon [name]="item.goal.icon" [size]="18" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-lilac-900">{{ item.goal.title }}</p>
                  <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-lilac-100">
                    <div class="h-full rounded-full bg-lilac-500" [style.width.%]="item.progress"></div>
                  </div>
                </div>
                <span class="shrink-0 text-xs font-semibold text-lilac-500">{{ item.progress }}%</span>
              </a>
            }
          </div>
        </section>
      }

      <section class="card-surface flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-lilac-600 to-lilac-700 p-5 text-white sm:p-6">
        <div class="min-w-0">
          <p class="text-sm font-medium text-white/80">Pequeños premios para ti</p>
          <p class="mt-1 text-lg font-semibold">{{ rewards.unlockedCount() }} recompensas disponibles</p>
        </div>
        <a
          routerLink="/recompensas"
          class="shrink-0 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          Ver
        </a>
      </section>
    </div>

    <app-task-modal
      [open]="modalOpen()"
      [task]="editingTask()"
      (close)="closeModal()"
      (save)="onSave($event)"
    />
  `,
})
export class DashboardComponent {
  protected readonly tasks = inject(TaskService);
  protected readonly goals = inject(GoalService);
  protected readonly rewards = inject(RewardService);
  protected readonly stats = inject(StatsService);
  private readonly celebration = inject(CelebrationService);

  readonly modalOpen = signal(false);
  readonly editingTask = signal<Task | null>(null);

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
    this.tasks.toggleComplete(task.id);
    if (!wasCompleted) this.celebration.celebrate();
  }

  onSave(event: { id?: string; draft: TaskDraft }): void {
    if (event.id) {
      this.tasks.update(event.id, event.draft);
    } else {
      this.tasks.add(event.draft);
    }
    this.closeModal();
  }
}
