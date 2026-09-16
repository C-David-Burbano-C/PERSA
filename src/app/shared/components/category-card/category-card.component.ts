import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CategoryId, categoryMeta } from '../../../core/models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="selected.emit(category())"
      class="group flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200"
      [class]="
        active()
          ? 'border-transparent bg-lilac-600 text-white shadow-soft'
          : 'border-lilac-100 bg-white/70 text-lilac-800 hover:border-lilac-200 hover:bg-lilac-50'
      "
    >
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        [class]="active() ? 'bg-white/20' : meta().bg + ' ' + meta().text"
      >
        <app-icon [name]="meta().icon" [size]="17" [strokeWidth]="1.8" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm font-medium">{{ meta().label }}</span>
        @if (count() !== undefined) {
          <span class="block text-xs" [class]="active() ? 'text-white/75' : 'text-lilac-400'">
            {{ count() }} {{ count() === 1 ? 'actividad' : 'actividades' }}
          </span>
        }
      </span>
    </button>
  `,
})
export class CategoryCardComponent {
  readonly category = input.required<CategoryId>();
  readonly active = input<boolean>(false);
  readonly count = input<number | undefined>(undefined);
  readonly selected = output<CategoryId>();

  readonly meta = computed(() => categoryMeta(this.category()));
}
