import { Injectable, computed, inject } from '@angular/core';
import { TaskService } from './task.service';
import { GoalService } from './goal.service';
import { RewardService } from './reward.service';
import { HeartsService } from './hearts.service';
import { addDays, todayIso } from '../utils/date.util';

/**
 * Junta estadísticas suaves de progreso a partir de los otros servicios,
 * sin volverse una app obsesionada con métricas. Solo lectura.
 */
@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly tasks = inject(TaskService);
  private readonly goals = inject(GoalService);
  private readonly rewards = inject(RewardService);
  private readonly hearts = inject(HeartsService);

  readonly completedTasks = computed(() => this.tasks.totalCompleted());
  readonly pendingTasks = computed(() => this.tasks.totalPending());
  readonly goalsAchieved = computed(() => this.goals.achievedCount());
  readonly heartsBalance = computed(() => this.hearts.balance());
  readonly heartsEarned = computed(() => this.hearts.lifetimeEarned());
  readonly rewardsUnlocked = computed(() => this.rewards.unlockedCount());
  readonly rewardsRedeemed = computed(() => this.rewards.redeemedCount());

  /** Días seguidos (hasta hoy) con al menos una tarea completada. Hoy todavía puede estar "abierto". */
  readonly streak = computed(() => {
    const completedDates = this.tasks.completedDates();
    let cursor = todayIso();
    if (!completedDates.has(cursor)) {
      cursor = addDays(cursor, -1);
    }
    let count = 0;
    while (completedDates.has(cursor)) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  });
}
