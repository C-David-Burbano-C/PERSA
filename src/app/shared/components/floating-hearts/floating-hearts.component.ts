import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { createId } from '../../../core/utils/id.util';

interface FloatingHeart {
  id: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

/**
 * Corazones flotantes para celebrar cositas pequeñas (completar una tarea,
 * canjear una recompensa) sin ser molestos. El padre llama a `burst()`;
 * si no, este componente no muestra nada.
 */
@Component({
  selector: 'app-floating-hearts',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-0 overflow-visible" aria-hidden="true">
      @for (heart of hearts(); track heart.id) {
        <span
          class="absolute bottom-0 text-blush-300"
          [style.left.%]="heart.left"
          [style.animation]="'drift ' + heart.duration + 's ease-in-out ' + heart.delay + 's 1 forwards'"
        >
          <app-icon name="heart-fill" [size]="heart.size" />
        </span>
      }
    </div>
  `,
})
export class FloatingHeartsComponent {
  readonly hearts = signal<FloatingHeart[]>([]);

  burst(count = 6): void {
    const created: FloatingHeart[] = Array.from({ length: count }, () => ({
      id: createId(),
      left: 10 + Math.random() * 80,
      duration: 5 + Math.random() * 3,
      delay: Math.random() * 0.8,
      size: 14 + Math.random() * 10,
    }));
    this.hearts.update((current) => [...current, ...created]);
    const maxLife = Math.max(...created.map((h) => h.duration + h.delay)) * 1000 + 200;
    setTimeout(() => {
      const ids = new Set(created.map((h) => h.id));
      this.hearts.update((current) => current.filter((h) => !ids.has(h.id)));
    }, maxLife);
  }
}
