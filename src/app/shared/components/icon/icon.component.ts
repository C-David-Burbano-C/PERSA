import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from './icon-registry';

/**
 * Pinta un ícono del registro local de SVGs. Nada de emojis, nada de
 * fuentes de íconos ni peticiones externas — todo va inline.
 *
 * Uso: <app-icon name="heart" class="h-5 w-5 text-lilac-600" />
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [innerHTML]="markup()"
      aria-hidden="true"
      focusable="false"
    ></svg>
  `,
  host: {
    class: 'inline-flex shrink-0 items-center justify-center',
  },
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(1.8);

  readonly markup = computed<SafeHtml>(() => {
    const svg = ICONS[this.name()] ?? ICONS['circle'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
