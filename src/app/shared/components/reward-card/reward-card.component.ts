import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Reward } from '../../../core/models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-reward-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card-surface animate-fade-up relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5 transition-all duration-300"
      [class.opacity-70]="reward().redeemed"
    >
      @if (reward().redeemed) {
        <span class="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-lilac-600 px-2.5 py-1 text-[11px] font-medium text-white">
          <app-icon name="check" [size]="11" [strokeWidth]="2.4" />
          Canjeada
        </span>
      }

      <span
        class="flex h-12 w-12 items-center justify-center rounded-2xl"
        [class]="reward().unlocked ? 'bg-lilac-600 text-white' : 'bg-lilac-100 text-lilac-400'"
      >
        <app-icon [name]="reward().icon" [size]="22" [strokeWidth]="1.6" />
      </span>

      <div class="min-w-0 flex-1">
        <h3 class="text-sm font-semibold text-lilac-950 sm:text-base">{{ reward().title }}</h3>
        <p class="mt-1 text-xs text-lilac-500 sm:text-sm">{{ reward().description }}</p>
      </div>

      <div class="flex items-center justify-between gap-3">
        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-lilac-500">
          <app-icon name="heart-fill" [size]="13" class="text-blush-400" />
          {{ reward().requiredPoints }} corazones
        </span>

        @if (!reward().redeemed) {
          <button
            type="button"
            [disabled]="!reward().unlocked"
            (click)="redeem.emit()"
            class="rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:bg-lilac-50 disabled:text-lilac-300"
            [class]="reward().unlocked ? 'bg-lilac-600 text-white shadow-soft hover:bg-lilac-700' : ''"
          >
            {{ reward().unlocked ? 'Desbloquear' : 'Aún no' }}
          </button>
        } @else {
          <button
            type="button"
            (click)="undo.emit()"
            class="text-xs font-medium text-lilac-400 underline-offset-2 hover:text-lilac-600 hover:underline"
          >
            Deshacer
          </button>
        }
      </div>
    </article>
  `,
})
export class RewardCardComponent {
  readonly reward = input.required<Reward>();
  readonly redeem = output<void>();
  readonly undo = output<void>();
}
