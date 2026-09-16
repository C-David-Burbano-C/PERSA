import { Injectable, inject } from '@angular/core';
import { TaskService } from './task.service';
import { GoalService } from './goal.service';
import { RewardService } from './reward.service';
import { JournalService } from './journal.service';
import { MemoryService } from './memory.service';
import { HeartsService } from './hearts.service';

/**
 * Borra todos los datos de ejemplo (tareas, metas, recompensas, journal,
 * recuerdos y corazones) para que la app quede en blanco y lista para
 * usarse de verdad. No toca los mensajes de amor, esos son fijos.
 */
@Injectable({ providedIn: 'root' })
export class ResetService {
  private readonly tasks = inject(TaskService);
  private readonly goals = inject(GoalService);
  private readonly rewards = inject(RewardService);
  private readonly journal = inject(JournalService);
  private readonly memories = inject(MemoryService);
  private readonly hearts = inject(HeartsService);

  clearExampleData(): void {
    this.tasks.clearAll();
    this.goals.clearAll();
    this.rewards.clearAll();
    this.journal.clearAll();
    this.memories.clearAll();
    this.hearts.reset();
  }
}
