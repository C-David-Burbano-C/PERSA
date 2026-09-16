import { Injectable, signal } from '@angular/core';

/**
 * Sirve de puente entre las pantallas (tarea completada, recompensa canjeada)
 * y los corazones flotantes del shell, sin que ninguno de los dos lados
 * tenga que conocer al otro.
 */
@Injectable({ providedIn: 'root' })
export class CelebrationService {
  /** Sube en cada celebrate() — el shell está pendiente de esto para lanzar los corazones. */
  readonly trigger = signal(0);

  celebrate(): void {
    this.trigger.update((n) => n + 1);
  }
}
