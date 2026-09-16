import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CelebrationService, TaskService } from '../../core/services';
import { CATEGORIES, CategoryId, Task, TaskDraft, TaskStatus } from '../../core/models';
import { TaskCardComponent } from '../../shared/components/task-card/task-card.component';
import { TaskModalComponent } from '../../shared/components/task-modal/task-modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';

type StatusFilter = 'todas' | TaskStatus;

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskCardComponent, TaskModalComponent, EmptyStateComponent, ConfirmDialogComponent, IconComponent, CategoryCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-display text-2xl text-lilac-950 sm:text-3xl">Mis tareas</h1>
          <p class="mt-1 text-sm text-lilac-500">Todo lo que quieres hacer, en un solo lugar.</p>
        </div>
        <button
          type="button"
          (click)="openNewTask()"
          class="inline-flex items-center gap-1.5 rounded-xl bg-lilac-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-lilac-700"
        >
          <app-icon name="plus" [size]="16" [strokeWidth]="2.2" />
          Nueva actividad
        </button>
      </div>

      <div class="flex flex-col gap-3">
        <div class="flex gap-2 overflow-x-auto pb-1">
          @for (s of statusOptions; track s.id) {
            <button
              type="button"
              (click)="statusFilter.set(s.id)"
              class="shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors"
              [class]="statusFilter() === s.id ? 'border-transparent bg-lilac-600 text-white' : 'border-lilac-200 bg-white/60 text-lilac-500 hover:bg-lilac-50'"
            >
              {{ s.label }}
            </button>
          }
        </div>

        <div>
          <div class="mb-2 flex items-center justify-between">
            <p class="text-xs font-medium text-lilac-400">Categorías</p>
            @if (categoryFilter()) {
              <button type="button" (click)="categoryFilter.set(null)" class="text-xs font-medium text-lilac-500 hover:underline">
                Ver todas
              </button>
            }
          </div>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            @for (c of categories; track c.id) {
              <app-category-card
                [category]="c.id"
                [active]="categoryFilter() === c.id"
                [count]="countFor(c.id)"
                (selected)="toggleCategory($event)"
              />
            }
          </div>
        </div>
      </div>

      @if (filtered().length) {
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          @for (task of filtered(); track task.id) {
            <app-task-card
              [task]="task"
              (toggleComplete)="onToggle(task)"
              (edit)="openEdit(task)"
              (remove)="askDelete(task)"
            />
          }
        </div>
      } @else {
        <app-empty-state icon="check-square" title="No hay actividades aquí" subtitle="Prueba otro filtro o crea una nueva actividad." />
      }
    </div>

    <app-task-modal [open]="modalOpen()" [task]="editingTask()" (close)="closeModal()" (save)="onSave($event)" />

    <app-confirm-dialog
      [open]="taskToDelete() !== null"
      title="¿Eliminar esta actividad?"
      message="Se quitará de tu lista para siempre."
      (cancel)="taskToDelete.set(null)"
      (confirm)="confirmDelete()"
    />
  `,
})
export class TasksComponent {
  protected readonly taskService = inject(TaskService);
  private readonly celebration = inject(CelebrationService);

  readonly categories = CATEGORIES;
  readonly statusOptions: { id: StatusFilter; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'completada', label: 'Completadas' },
  ];

  readonly statusFilter = signal<StatusFilter>('todas');
  readonly categoryFilter = signal<CategoryId | null>(null);

  readonly modalOpen = signal(false);
  readonly editingTask = signal<Task | null>(null);
  readonly taskToDelete = signal<Task | null>(null);

  readonly filtered = computed(() => {
    const status = this.statusFilter();
    const category = this.categoryFilter();
    return this.taskService
      .tasks()
      .filter((t) => (status === 'todas' ? true : status === 'completada' ? t.status === 'completada' : t.status !== 'completada'))
      .filter((t) => (category ? t.category === category : true))
      .sort((a, b) => (a.date + (a.time ?? '99:99')).localeCompare(b.date + (b.time ?? '99:99')));
  });

  countFor(category: CategoryId): number {
    return this.taskService.tasks().filter((t) => t.category === category).length;
  }

  toggleCategory(category: CategoryId): void {
    this.categoryFilter.set(this.categoryFilter() === category ? null : category);
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
