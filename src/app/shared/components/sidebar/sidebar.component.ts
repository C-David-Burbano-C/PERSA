import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ITEMS } from '../../../core/models';
import { IconComponent } from '../icon/icon.component';

/** Menú lateral para escritorio / tablet horizontal. Se oculta por debajo del breakpoint lg. */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="hidden w-64 shrink-0 flex-col border-r border-lilac-100 bg-white/70 px-4 py-6 lg:flex">
      <div class="mb-8 flex items-center gap-2.5 px-2">
        <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-lilac-600 text-white shadow-soft">
          <app-icon name="heart-fill" [size]="18" />
        </span>
        <div>
          <p class="font-display text-lg leading-tight text-lilac-950">Persa</p>
          <p class="text-[11px] text-lilac-400">tu pequeño espacio</p>
        </div>
      </div>

      <nav class="flex flex-1 flex-col gap-1">
        @for (item of items; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-lilac-600 text-white shadow-soft"
            #rla="routerLinkActive"
            class="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-lilac-600 transition-all duration-200 hover:bg-lilac-50"
            [class.hover:bg-lilac-50]="!rla.isActive"
          >
            <app-icon [name]="item.icon" [size]="18" [strokeWidth]="rla.isActive ? 2 : 1.7" />
            {{ item.label }}
          </a>
        }
      </nav>

      <p class="px-2 text-[11px] leading-relaxed text-lilac-300">
        Hecho con cariño, solo para ti.
      </p>
    </aside>
  `,
})
export class SidebarComponent {
  readonly items = NAV_ITEMS;
}
