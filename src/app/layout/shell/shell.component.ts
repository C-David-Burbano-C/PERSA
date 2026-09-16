import { ChangeDetectionStrategy, Component, ViewChild, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FloatingHeartsComponent } from '../../shared/components/floating-hearts/floating-hearts.component';
import { CelebrationService } from '../../core/services';
import { NAV_ITEMS } from '../../core/models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, BottomNavComponent, NavbarComponent, FloatingHeartsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-dvh bg-app-gradient">
      <app-sidebar />

      <div class="flex min-w-0 flex-1 flex-col">
        <app-navbar [title]="currentTitle()" />
        <main class="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10">
          <router-outlet />
        </main>
      </div>

      <app-bottom-nav />
    </div>
    <app-floating-hearts #hearts />
  `,
})
export class ShellComponent {
  @ViewChild('hearts') private heartsRef?: FloatingHeartsComponent;

  private readonly router = inject(Router);
  private readonly celebration = inject(CelebrationService);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly currentTitle = signal('Persa');

  constructor() {
    effect(() => {
      const url = this.url();
      const match = NAV_ITEMS.find((item) => url.startsWith(item.path));
      this.currentTitle.set(match?.label ?? 'Persa');
    });

    effect(() => {
      if (this.celebration.trigger() > 0) {
        this.heartsRef?.burst();
      }
    });
  }
}
