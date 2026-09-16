import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Goal, categoryMeta } from '../../../core/models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-goal-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card-surface animate-fade-up flex flex-col gap-4 rounded-2xl p-5">
      <div class="flex items-start gap-3">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" [class]="meta().bg + ' ' + meta().text">
          <app-icon [name]="goal().icon" [size]="20" [strokeWidth]="1.6" />
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-semibold text-lilac-950 sm:text-base">{{ goal().title }}</h3>
          <p class="mt-0.5 line-clamp-2 text-xs text-lilac-500 sm:text-sm">{{ goal().description }}</p>
        </div>
        <div class="flex shrink-0 items-center gap-1">
          <button type="button" (click)="edit.emit()" class="rounded-lg p-1.5 text-lilac-400 hover:bg-lilac-100 hover:text-lilac-700" aria-label="Editar meta">
            <app-icon name="pencil" [size]="14" />
          </button>
          <button type="button" (click)="remove.emit()" class="rounded-lg p-1.5 text-lilac-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Eliminar meta">
            <app-icon name="trash" [size]="14" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-lilac-100">
          <div class="h-full rounded-full bg-gradient-to-r from-lilac-400 to-blush-400 transition-all duration-500" [style.width.%]="progress()"></div>
        </div>
        <span class="text-xs font-medium text-lilac-500">{{ progress() }}%</span>
      </div>

      <ul class="space-y-1.5">
        @for (step of goal().steps; track step.id) {
          <li>
            <button
              type="button"
              (click)="toggleStep.emit(step.id)"
              class="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1 text-left text-sm transition-colors hover:bg-lilac-50"
            >
              <span
                class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors"
                [class]="step.done ? 'border-lilac-600 bg-lilac-600 text-white' : 'border-lilac-300 text-transparent'"
              >
                <app-icon name="check" [size]="11" [strokeWidth]="2.6" />
              </span>
              <span class="truncate" [class]="step.done ? 'text-lilac-400 line-through' : 'text-lilac-700'">{{ step.label }}</span>
            </button>
          </li>
        }
      </ul>
    </article>
  `,
})
export class GoalCardComponent {
  readonly goal = input.required<Goal>();
  readonly toggleStep = output<string>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  readonly meta = computed(() => categoryMeta(this.goal().category));
  readonly progress = computed(() => {
    const steps = this.goal().steps;
    if (!steps.length) return 0;
    return Math.round((steps.filter((s) => s.done).length / steps.length) * 100);
  });
}
