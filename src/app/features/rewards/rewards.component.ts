import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CelebrationService, HeartsService, RewardService } from '../../core/services';
import { Reward, RewardDraft } from '../../core/models';
import { RewardCardComponent } from '../../shared/components/reward-card/reward-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FormsModule } from '@angular/forms';

const REWARD_ICONS = ['gift', 'clapperboard', 'ice-cream', 'mail-heart', 'sparkles', 'hand-heart', 'rose', 'pizza', 'mountain'];

interface RewardFormState {
  title: string;
  description: string;
  icon: string;
  requiredPoints: number;
}

function blankState(): RewardFormState {
  return { title: '', description: '', icon: 'gift', requiredPoints: 50 };
}

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [RewardCardComponent, EmptyStateComponent, IconComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-display text-2xl text-lilac-950 sm:text-3xl">Pequeños premios para ti</h1>
          <p class="mt-1 text-sm text-lilac-500">Cada actividad que completas suma corazones.</p>
        </div>
        <button
          type="button"
          (click)="modalOpen.set(true)"
          class="inline-flex items-center gap-1.5 rounded-xl bg-lilac-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-lilac-700"
        >
          <app-icon name="plus" [size]="16" [strokeWidth]="2.2" />
          Nueva recompensa
        </button>
      </div>

      <div class="card-surface flex items-center gap-4 rounded-2xl bg-gradient-to-br from-lilac-600 to-lilac-700 p-6 text-white">
        <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <app-icon name="heart-fill" [size]="26" />
        </span>
        <div>
          <p class="text-sm text-white/80">Tienes</p>
          <p class="text-3xl font-semibold">{{ hearts.balance() }} corazones</p>
        </div>
      </div>

      @if (rewards.rewards().length) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (reward of rewards.rewards(); track reward.id) {
            <app-reward-card [reward]="reward" (redeem)="onRedeem(reward)" (undo)="rewards.unredeem(reward.id)" />
          }
        </div>
      } @else {
        <app-empty-state icon="gift" title="Aún no hay recompensas" subtitle="Crea pequeños premios para desbloquear con tus corazones." />
      }
    </div>

    @if (modalOpen()) {
      <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div class="absolute inset-0 bg-lilac-950/30 backdrop-blur-sm" (click)="modalOpen.set(false)"></div>
        <div class="animate-pop relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-soft-lg sm:rounded-3xl">
          <header class="flex shrink-0 items-center justify-between border-b border-lilac-100 px-5 py-4 sm:px-6">
            <h2 class="text-base font-semibold text-lilac-950 sm:text-lg">Nueva recompensa</h2>
            <button type="button" (click)="modalOpen.set(false)" class="rounded-lg p-1.5 text-lilac-400 hover:bg-lilac-50 hover:text-lilac-700">
              <app-icon name="x" [size]="18" />
            </button>
          </header>
          <div class="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Ícono</label>
              <div class="flex flex-wrap gap-2">
                @for (icon of icons; track icon) {
                  <button
                    type="button"
                    (click)="form.icon = icon"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border transition-colors"
                    [class]="form.icon === icon ? 'border-transparent bg-lilac-600 text-white' : 'border-lilac-200 text-lilac-500 hover:bg-lilac-50'"
                  >
                    <app-icon [name]="icon" [size]="17" />
                  </button>
                }
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Título</label>
              <input
                type="text"
                [(ngModel)]="form.title"
                placeholder="Ej. Una cita sorpresa"
                class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Descripción</label>
              <textarea
                [(ngModel)]="form.description"
                rows="2"
                placeholder="¿En qué consiste este premio?"
                class="w-full resize-none rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              ></textarea>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Corazones necesarios: {{ form.requiredPoints }}</label>
              <input type="range" min="10" max="300" step="10" [(ngModel)]="form.requiredPoints" class="w-full accent-lilac-600" />
            </div>
          </div>
          <footer class="flex shrink-0 items-center justify-end gap-2 border-t border-lilac-100 px-5 py-4 sm:px-6">
            <button type="button" (click)="modalOpen.set(false)" class="rounded-xl px-4 py-2.5 text-sm font-medium text-lilac-600 hover:bg-lilac-50">
              Cancelar
            </button>
            <button
              type="button"
              [disabled]="!form.title.trim()"
              (click)="submit()"
              class="rounded-xl bg-lilac-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-lilac-700 disabled:cursor-not-allowed disabled:bg-lilac-200"
            >
              Crear recompensa
            </button>
          </footer>
        </div>
      </div>
    }
  `,
})
export class RewardsComponent {
  protected readonly rewards = inject(RewardService);
  protected readonly hearts = inject(HeartsService);
  private readonly celebration = inject(CelebrationService);

  readonly icons = REWARD_ICONS;
  readonly modalOpen = signal(false);
  form: RewardFormState = blankState();

  onRedeem(reward: Reward): void {
    if (this.rewards.redeem(reward.id)) {
      this.celebration.celebrate();
    }
  }

  submit(): void {
    if (!this.form.title.trim()) return;
    const draft: RewardDraft = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      icon: this.form.icon,
      requiredPoints: this.form.requiredPoints,
    };
    this.rewards.add(draft);
    this.form = blankState();
    this.modalOpen.set(false);
  }
}
