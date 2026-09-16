import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService } from '../../../core/services';
import { IconComponent } from '../icon/icon.component';

/** Las dos frases que cambian cada día arriba del dashboard. */
@Component({
  selector: 'app-daily-message',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-up space-y-3 rounded-2xl bg-gradient-to-br from-lilac-100 via-lavender-100 to-blush-50 p-5 ring-1 ring-lilac-100 sm:p-6">
      <p class="flex items-start gap-2 text-base font-medium text-lilac-900 sm:text-lg">
        <app-icon name="sparkle" [size]="18" class="mt-1 text-lilac-500" />
        <span>{{ messages.dailyPhrase() }}</span>
      </p>
      <p class="flex items-start gap-2 text-sm text-lilac-600">
        <app-icon name="heart-fill" [size]="14" class="mt-1 shrink-0 text-blush-400" />
        <span>{{ messages.dailyNote() }}</span>
      </p>
    </div>
  `,
})
export class DailyMessageComponent {
  protected readonly messages = inject(MessageService);
}
