import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MOBILE_NAV_ITEMS } from '../../../core/models';
import { IconComponent } from '../icon/icon.component';

/** Barra de navegación inferior para móvil. Desde el breakpoint lg se oculta y toma el relevo el sidebar. */
@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-lilac-100 bg-white/90 px-1 backdrop-blur-lg lg:hidden"
      style="padding-bottom: env(safe-area-inset-bottom, 0px)"
    >
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="text-lilac-600"
          #rla="routerLinkActive"
          class="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10.5px] font-medium text-lilac-400 transition-colors"
        >
          <app-icon [name]="item.icon" [size]="19" [strokeWidth]="rla.isActive ? 2.1 : 1.7" />
          {{ item.label }}
        </a>
      }
    </nav>
  `,
})
export class BottomNavComponent {
  readonly items = MOBILE_NAV_ITEMS;
}
