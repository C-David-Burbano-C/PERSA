import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-lilac-950/30 backdrop-blur-sm animate-pop" (click)="cancel.emit()"></div>
        <div class="animate-pop relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft-lg">
          <span class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-400">
            <app-icon name="trash" [size]="20" />
          </span>
          <h3 class="text-base font-semibold text-lilac-950">{{ title() }}</h3>
          <p class="mt-1.5 text-sm text-lilac-500">{{ message() }}</p>
          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              (click)="cancel.emit()"
              class="rounded-xl px-4 py-2 text-sm font-medium text-lilac-600 transition-colors hover:bg-lilac-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="confirm.emit()"
              class="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-rose-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly open = input<boolean>(false);
  readonly title = input<string>('¿Eliminar esto?');
  readonly message = input<string>('Esta acción no se puede deshacer.');
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
