import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex min-h-dvh items-center justify-center overflow-hidden bg-app-gradient px-5 py-12">
      <div class="animate-float pointer-events-none absolute -left-10 top-16 text-lilac-200/60">
        <app-icon name="heart-fill" [size]="120" />
      </div>
      <div class="animate-float pointer-events-none absolute -right-8 bottom-24 text-blush-200/60" style="animation-delay: 1.5s">
        <app-icon name="sparkle" [size]="90" />
      </div>
      <div class="animate-float pointer-events-none absolute right-10 top-24 text-lavender-200/70" style="animation-delay: 0.7s">
        <app-icon name="flower" [size]="60" />
      </div>

      <div class="animate-fade-up card-surface relative w-full max-w-lg rounded-3xl p-7 text-center sm:p-10">
        <span class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-lilac-600 text-white shadow-soft-lg">
          <app-icon name="heart-fill" [size]="28" />
        </span>

        <p class="text-xs font-medium uppercase tracking-[0.2em] text-lilac-400">un pequeño espacio</p>
        <h1 class="mt-2 font-display text-3xl text-lilac-950 sm:text-4xl">Persa</h1>

        <p class="mx-auto mt-6 max-w-md text-sm leading-relaxed text-lilac-600 sm:text-base">
          Hice este pequeño espacio para ti porque quiero ayudarte, aunque sea de una pequeña forma, a poner en
          orden todas esas cosas que quieres hacer. No para llenarte de pendientes ni para exigirte más, sino para
          que puedas ver tus ideas, tus metas y esas pequeñas cosas que quieres lograr, todo en un solo lugar. Y
          porque también quiero acompañarte en el proceso.
        </p>

        <p class="mt-5 text-sm font-medium text-lilac-800">Este lugar es tuyo.</p>

        <button
          type="button"
          (click)="enter()"
          class="mt-8 inline-flex items-center gap-2 rounded-2xl bg-lilac-600 px-7 py-3.5 text-sm font-semibold text-white shadow-soft-lg transition-transform duration-200 hover:scale-[1.03] hover:bg-lilac-700 sm:text-base"
        >
          Entrar a mi espacio
          <app-icon name="chevron-right" [size]="17" [strokeWidth]="2.2" />
        </button>
      </div>
    </div>
  `,
})
export class OnboardingComponent {
  constructor(private readonly router: Router) {}

  enter(): void {
    this.router.navigateByUrl('/inicio');
  }
}
