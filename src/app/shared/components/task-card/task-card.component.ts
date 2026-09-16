import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Task, categoryMeta } from '../../../core/models';
import { formatFriendly } from '../../../core/utils/date.util';
import { IconComponent } from '../icon/icon.component';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { CategoryBadgeComponent } from '../category-card/category-badge.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [IconComponent, PriorityBadgeComponent, CategoryBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card-surface animate-fade-up group relative flex flex-col gap-3 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg sm:p-5"
      [class.opacity-60]="task().status === 'completada'"
    >
      <div class="flex items-start gap-3">
        <span
          class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          [class]="meta().bg + ' ' + meta().text"
        >
          <app-icon [name]="meta().icon" [size]="15" [strokeWidth]="1.8" />
        </span>

        <div class="min-w-0 flex-1">
          <h3
            class="truncate text-sm font-semibold text-lilac-950 sm:text-base"
            [class.line-through]="task().status === 'completada'"
          >
            {{ task().title }}
          </h3>
          @if (task().description) {
            <p class="mt-0.5 line-clamp-2 text-xs text-lilac-500 sm:text-sm">{{ task().description }}</p>
          }
        </div>

        <div class="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            (click)="edit.emit()"
            class="rounded-lg p-1.5 text-lilac-400 transition-colors hover:bg-lilac-100 hover:text-lilac-700"
            aria-label="Editar actividad"
          >
            <app-icon name="pencil" [size]="15" />
          </button>
          <button
            type="button"
            (click)="remove.emit()"
            class="rounded-lg p-1.5 text-lilac-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            aria-label="Eliminar actividad"
          >
            <app-icon name="trash" [size]="15" />
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 text-xs text-lilac-500">
        <span class="inline-flex items-center gap-1">
          <app-icon name="calendar" [size]="13" />
          {{ friendlyDate() }}{{ task().time ? ' · ' + task().time : '' }}
        </span>
        <app-priority-badge [priority]="task().priority" />
        <app-category-badge [category]="task().category" />
      </div>

      @if (task().checklist.length || task().progress > 0) {
        <div class="flex items-center gap-2.5">
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-lilac-100">
            <div
              class="h-full rounded-full bg-gradient-to-r from-lilac-400 to-lilac-600 transition-all duration-500"
              [style.width.%]="task().progress"
            ></div>
          </div>
          <span class="w-9 shrink-0 text-right text-xs font-medium text-lilac-500">{{ task().progress }}%</span>
        </div>
      }

      <button
        type="button"
        (click)="toggleComplete.emit()"
        class="mt-1 inline-flex items-center justify-center gap-1.5 self-start rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm"
        [class]="
          task().status === 'completada'
            ? 'bg-lilac-100 text-lilac-600 hover:bg-lilac-200'
            : 'bg-lilac-600 text-white shadow-soft hover:bg-lilac-700'
        "
      >
        <app-icon name="check" [size]="15" [strokeWidth]="2.2" />
        {{ task().status === 'completada' ? 'Completada' : 'Completar' }}
      </button>
    </article>
  `,
})
export class TaskCardComponent {
  readonly task = input.required<Task>();

  readonly toggleComplete = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  readonly meta = computed(() => categoryMeta(this.task().category));
  readonly friendlyDate = computed(() => formatFriendly(this.task().date));
}
