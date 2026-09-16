import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-up flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-lilac-200 bg-white/50 px-6 py-12 text-center">
      <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-lilac-100 text-lilac-400">
        <app-icon [name]="icon()" [size]="26" [strokeWidth]="1.5" />
      </span>
      <p class="text-sm font-medium text-lilac-700">{{ title() }}</p>
      @if (subtitle()) {
        <p class="max-w-xs text-xs text-lilac-400">{{ subtitle() }}</p>
      }
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input<string>('sparkle');
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
