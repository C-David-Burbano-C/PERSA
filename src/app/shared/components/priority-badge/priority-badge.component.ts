import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PRIORITIES, Priority } from '../../../core/models';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      [class]="meta().bg + ' ' + meta().text"
    >
      <span class="h-1.5 w-1.5 rounded-full" [class]="meta().dot"></span>
      {{ meta().label }}
    </span>
  `,
})
export class PriorityBadgeComponent {
  readonly priority = input.required<Priority>();
  readonly meta = computed(() => PRIORITIES[this.priority()]);
}
