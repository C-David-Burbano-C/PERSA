import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeartsService, ResetService } from '../../../core/services';
import { IconComponent } from '../icon/icon.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

/** Barra superior de cada página: nombre de la app, título de la sección y corazones. */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, IconComponent, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-30 flex items-center justify-between border-b border-lilac-100 bg-lilac-50/80 px-4 py-3.5 backdrop-blur-lg sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 lg:hidden">
        <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-lilac-600 text-white">
          <app-icon name="heart-fill" [size]="14" />
        </span>
        <p class="font-display text-base leading-none text-lilac-950">Persa</p>
      </div>

      <h1 class="hidden text-lg font-semibold text-lilac-950 lg:block">{{ title() }}</h1>

      <div class="flex items-center gap-2">
        <button
          type="button"
          (click)="confirmOpen.set(true)"
          class="rounded-full p-2 text-lilac-400 transition-colors hover:bg-lilac-100 hover:text-lilac-700"
          aria-label="Borrar datos de ejemplo"
          title="Borrar datos de ejemplo"
        >
          <app-icon name="trash" [size]="16" />
        </button>

        <a
          routerLink="/recompensas"
          class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-lilac-700 shadow-soft ring-1 ring-lilac-100 transition-transform hover:scale-105"
        >
          <app-icon name="heart-fill" [size]="14" class="text-blush-400" />
          {{ hearts.balance() }}
        </a>
      </div>
    </header>

    <app-confirm-dialog
      [open]="confirmOpen()"
      title="¿Borrar los datos de ejemplo?"
      message="Se van a borrar todas las tareas, metas, recompensas, journal y recuerdos de ejemplo, y los corazones vuelven a cero. Esto no se puede deshacer."
      (cancel)="confirmOpen.set(false)"
      (confirm)="onConfirmClear()"
    />
  `,
})
export class NavbarComponent {
  readonly title = input<string>('Persa');
  protected readonly hearts = inject(HeartsService);
  private readonly reset = inject(ResetService);

  readonly confirmOpen = signal(false);

  onConfirmClear(): void {
    this.reset.clearExampleData();
    this.confirmOpen.set(false);
  }
}
