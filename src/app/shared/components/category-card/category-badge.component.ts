import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CategoryId, categoryMeta } from '../../../core/models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-category-badge',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
      [class]="meta().bg + ' ' + meta().text + ' ' + meta().ring"
    >
      <app-icon [name]="meta().icon" [size]="13" [strokeWidth]="2" />
      {{ meta().label }}
    </span>
  `,
})
export class CategoryBadgeComponent {
  readonly category = input.required<CategoryId>();
  readonly meta = computed(() => categoryMeta(this.category()));
}
