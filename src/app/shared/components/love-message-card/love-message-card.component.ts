import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LoveMessage } from '../../../core/models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-love-message-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="animate-pop card-surface relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <span class="pointer-events-none absolute -right-4 -top-4 text-lilac-50">
        <app-icon name="heart-fill" [size]="110" />
      </span>
      <div class="relative">
        <span class="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lilac-100 text-lilac-600">
          <app-icon name="mail-heart" [size]="18" [strokeWidth]="1.7" />
        </span>
        <h3 class="font-display text-lg font-semibold text-lilac-950 sm:text-xl">{{ message().title }}</h3>
        <p class="mt-2 text-sm leading-relaxed text-lilac-600 sm:text-base">{{ message().message }}</p>
      </div>
    </article>
  `,
})
export class LoveMessageCardComponent {
  readonly message = input.required<LoveMessage>();
}
