import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GoalService } from '../../core/services';
import { CategoryId, Goal, GoalStep } from '../../core/models';
import { GoalCardComponent } from '../../shared/components/goal-card/goal-card.component';
import { GoalModalComponent } from '../../shared/components/goal-modal/goal-modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [GoalCardComponent, GoalModalComponent, EmptyStateComponent, ConfirmDialogComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-display text-2xl text-lilac-950 sm:text-3xl">Cosas que quiero lograr</h1>
          <p class="mt-1 text-sm text-lilac-500">Metas grandes, divididas en pasos pequeños.</p>
        </div>
        <button
          type="button"
          (click)="openNew()"
          class="inline-flex items-center gap-1.5 rounded-xl bg-lilac-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-lilac-700"
        >
          <app-icon name="plus" [size]="16" [strokeWidth]="2.2" />
          Nueva meta
        </button>
      </div>

      @if (goals.goals().length) {
        <div class="grid gap-4 sm:grid-cols-2">
          @for (goal of goals.goals(); track goal.id) {
            <app-goal-card
              [goal]="goal"
              (toggleStep)="goals.toggleStep(goal.id, $event)"
              (edit)="openEdit(goal)"
              (remove)="askDelete(goal)"
            />
          }
        </div>
      } @else {
        <app-empty-state icon="target" title="Aún no tienes metas" subtitle="Crea una meta y divídela en pequeños pasos para llegar sin presión." />
      }
    </div>

    <app-goal-modal [open]="modalOpen()" [goal]="editingGoal()" (close)="closeModal()" (save)="onSave($event)" />

    <app-confirm-dialog
      [open]="goalToDelete() !== null"
      title="¿Eliminar esta meta?"
      message="Se perderán también sus pasos guardados."
      (cancel)="goalToDelete.set(null)"
      (confirm)="confirmDelete()"
    />
  `,
})
export class GoalsComponent {
  protected readonly goals = inject(GoalService);

  readonly modalOpen = signal(false);
  readonly editingGoal = signal<Goal | null>(null);
  readonly goalToDelete = signal<Goal | null>(null);

  openNew(): void {
    this.editingGoal.set(null);
    this.modalOpen.set(true);
  }

  openEdit(goal: Goal): void {
    this.editingGoal.set(goal);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  askDelete(goal: Goal): void {
    this.goalToDelete.set(goal);
  }

  confirmDelete(): void {
    const goal = this.goalToDelete();
    if (goal) this.goals.remove(goal.id);
    this.goalToDelete.set(null);
  }

  onSave(event: { id?: string; title: string; description: string; icon: string; category: CategoryId; steps: GoalStep[] }): void {
    if (event.id) {
      this.goals.update(event.id, { title: event.title, description: event.description, icon: event.icon, category: event.category });
      // Sincronizo los pasos uno por uno (agregar/quitar/renombrar) en vez de
      // borrar todo y volver a crear, así no se pierden los ids.
      const existing = this.goals.getById(event.id);
      if (existing) {
        const existingIds = new Set(existing.steps.map((s) => s.id));
        const nextIds = new Set(event.steps.map((s) => s.id));
        existing.steps.filter((s) => !nextIds.has(s.id)).forEach((s) => this.goals.removeStep(event.id!, s.id));
        event.steps.forEach((s) => {
          if (!existingIds.has(s.id)) {
            this.goals.addStep(event.id!, s.label);
          } else {
            this.goals.updateStep(event.id!, s.id, s.label);
          }
        });
      }
    } else {
      this.goals.add({ title: event.title, description: event.description, icon: event.icon, category: event.category, steps: event.steps });
    }
    this.closeModal();
  }
}
