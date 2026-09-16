import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/** Tarjetita de estadística que uso en el dashboard y en el progreso. */
@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card-surface animate-fade-up flex items-center gap-3 rounded-2xl p-4">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lilac-100 text-lilac-600">
        <app-icon [name]="icon()" [size]="19" [strokeWidth]="1.8" />
      </span>
      <div class="min-w-0">
        <p class="text-xl font-semibold leading-tight text-lilac-950">{{ value() }}</p>
        <p class="truncate text-xs text-lilac-400">{{ label() }}</p>
      </div>
    </div>
  `,
})
export class ProgressCardComponent {
  readonly icon = input.required<string>();
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
}
