import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PwaInstallService } from '../../../core/services';
import { IconComponent } from '../icon/icon.component';

/**
 * Botón "Descargar" de la barra de arriba. Si el navegador puede instalar
 * la app, lo hace de una vez; si no (como en iPhone), muestra los pasos a
 * mano. Siempre deja el mensajito de que también se puede instalar desde
 * el celular, por si no quieres usar la computadora.
 */
@Component({
  selector: 'app-install-button',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!pwa.isStandalone()) {
      <div class="relative">
        <button
          type="button"
          (click)="open.set(!open())"
          class="inline-flex items-center gap-1.5 rounded-full bg-lilac-600 px-3 py-1.5 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-105"
        >
          <app-icon name="download" [size]="14" [strokeWidth]="2.1" />
          <span class="hidden sm:inline">Descargar</span>
        </button>

        @if (open()) {
          <div class="fixed inset-0 z-30" (click)="open.set(false)"></div>
          <div
            class="animate-pop fixed inset-x-4 top-16 z-40 mx-auto max-w-xs rounded-2xl bg-white p-4 text-left shadow-soft-lg ring-1 ring-lilac-100 sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+10px)] sm:mx-0 sm:w-80 sm:max-w-none"
          >
            <div class="mb-2 flex items-start justify-between gap-2">
              <p class="text-sm font-semibold text-lilac-950">Descargar Persa</p>
              <button type="button" (click)="open.set(false)" class="rounded-lg p-1 text-lilac-400 hover:bg-lilac-50" aria-label="Cerrar">
                <app-icon name="x" [size]="14" />
              </button>
            </div>

            <p class="flex items-start gap-1.5 text-xs leading-relaxed text-lilac-500">
              <app-icon name="smartphone" [size]="14" class="mt-0.5 shrink-0 text-lilac-400" />
              <span>
                Si no quieres usar la computadora, también puedes abrir este mismo enlace desde tu celular y
                descargarla ahí, para tenerla siempre a la mano.
              </span>
            </p>

            @if (pwa.canInstall()) {
              <button
                type="button"
                (click)="install()"
                class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-lilac-600 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-lilac-700"
              >
                <app-icon name="download" [size]="14" [strokeWidth]="2.2" />
                Instalar ahora
              </button>
            } @else if (pwa.isIos()) {
              <p class="mt-3 rounded-xl bg-lilac-50 px-3 py-2 text-[11px] leading-relaxed text-lilac-600">
                En iPhone: toca el botón <strong>Compartir</strong> de Safari y elige
                <strong>«Agregar a pantalla de inicio»</strong>.
              </p>
            } @else {
              <p class="mt-3 rounded-xl bg-lilac-50 px-3 py-2 text-[11px] leading-relaxed text-lilac-600">
                Busca el ícono de instalar en la barra de direcciones del navegador (o el menú ⋮ &gt;
                «Instalar app»).
              </p>
            }
          </div>
        }
      </div>
    }
  `,
})
export class InstallButtonComponent {
  protected readonly pwa = inject(PwaInstallService);
  readonly open = signal(false);

  async install(): Promise<void> {
    await this.pwa.promptInstall();
    this.open.set(false);
  }
}
