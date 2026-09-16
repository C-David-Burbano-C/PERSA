import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CATEGORIES, CategoryId, Goal, GoalStep } from '../../../core/models';
import { createId } from '../../../core/utils/id.util';
import { IconComponent } from '../icon/icon.component';

const GOAL_ICONS = ['target', 'plane', 'flower', 'book-open', 'briefcase', 'heart', 'palette', 'sparkle', 'mountain'];

interface GoalFormState {
  title: string;
  description: string;
  icon: string;
  category: CategoryId;
  steps: GoalStep[];
}

function blankState(): GoalFormState {
  return { title: '', description: '', icon: 'target', category: 'personal', steps: [] };
}

@Component({
  selector: 'app-goal-modal',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div class="absolute inset-0 bg-lilac-950/30 backdrop-blur-sm" (click)="close.emit()"></div>

        <div class="animate-pop relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-soft-lg sm:rounded-3xl">
          <header class="flex shrink-0 items-center justify-between border-b border-lilac-100 px-5 py-4 sm:px-6">
            <h2 class="text-base font-semibold text-lilac-950 sm:text-lg">{{ goal() ? 'Editar meta' : 'Nueva meta' }}</h2>
            <button type="button" (click)="close.emit()" class="rounded-lg p-1.5 text-lilac-400 hover:bg-lilac-50 hover:text-lilac-700" aria-label="Cerrar">
              <app-icon name="x" [size]="18" />
            </button>
          </header>

          <div class="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Ícono</label>
              <div class="flex flex-wrap gap-2">
                @for (icon of icons; track icon) {
                  <button
                    type="button"
                    (click)="form.icon = icon"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border transition-colors"
                    [class]="form.icon === icon ? 'border-transparent bg-lilac-600 text-white' : 'border-lilac-200 text-lilac-500 hover:bg-lilac-50'"
                  >
                    <app-icon [name]="icon" [size]="17" />
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Título de la meta</label>
              <input
                type="text"
                [(ngModel)]="form.title"
                placeholder="Ej. Viajar juntos"
                class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Descripción</label>
              <textarea
                [(ngModel)]="form.description"
                rows="2"
                placeholder="¿Por qué es importante esta meta?"
                class="w-full resize-none rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              ></textarea>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Categoría</label>
              <div class="flex flex-wrap gap-2">
                @for (c of categories; track c.id) {
                  <button
                    type="button"
                    (click)="form.category = c.id"
                    class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                    [class]="form.category === c.id ? 'border-transparent bg-lilac-600 text-white' : 'border-lilac-200 text-lilac-500 hover:bg-lilac-50'"
                  >
                    <app-icon [name]="c.icon" [size]="12" />
                    {{ c.label }}
                  </button>
                }
              </div>
            </div>

            <div>
              <div class="mb-1.5 flex items-center justify-between">
                <label class="block text-xs font-medium text-lilac-500">Pequeños pasos</label>
                <button type="button" (click)="addStep()" class="text-xs font-medium text-lilac-600 hover:underline">+ Añadir paso</button>
              </div>
              <div class="space-y-2">
                @for (step of form.steps; track step.id) {
                  <div class="flex items-center gap-2">
                    <input
                      type="text"
                      [(ngModel)]="step.label"
                      [ngModelOptions]="{ standalone: true }"
                      placeholder="Ej. Ahorrar la primera parte"
                      class="flex-1 rounded-lg border border-lilac-200 bg-lilac-50/50 px-3 py-1.5 text-xs text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
                    />
                    <button type="button" (click)="removeStep(step.id)" class="shrink-0 rounded-lg p-1.5 text-lilac-400 hover:bg-rose-50 hover:text-rose-500">
                      <app-icon name="x" [size]="14" />
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>

          <footer class="flex shrink-0 items-center justify-end gap-2 border-t border-lilac-100 px-5 py-4 sm:px-6">
            <button type="button" (click)="close.emit()" class="rounded-xl px-4 py-2.5 text-sm font-medium text-lilac-600 hover:bg-lilac-50">
              Cancelar
            </button>
            <button
              type="button"
              [disabled]="!form.title.trim()"
              (click)="submit()"
              class="rounded-xl bg-lilac-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-lilac-700 disabled:cursor-not-allowed disabled:bg-lilac-200"
            >
              {{ goal() ? 'Guardar cambios' : 'Crear meta' }}
            </button>
          </footer>
        </div>
      </div>
    }
  `,
})
export class GoalModalComponent {
  readonly open = input<boolean>(false);
  readonly goal = input<Goal | null>(null);

  readonly close = output<void>();
  readonly save = output<{ id?: string; title: string; description: string; icon: string; category: CategoryId; steps: GoalStep[] }>();

  readonly icons = GOAL_ICONS;
  readonly categories = CATEGORIES;
  form: GoalFormState = blankState();

  constructor() {
    effect(() => {
      const goal = this.goal();
      if (!this.open()) return;
      this.form = goal
        ? { title: goal.title, description: goal.description, icon: goal.icon, category: goal.category, steps: goal.steps.map((s) => ({ ...s })) }
        : blankState();
    });
  }

  addStep(): void {
    this.form.steps = [...this.form.steps, { id: createId(), label: '', done: false }];
  }

  removeStep(id: string): void {
    this.form.steps = this.form.steps.filter((s) => s.id !== id);
  }

  submit(): void {
    if (!this.form.title.trim()) return;
    this.save.emit({
      id: this.goal()?.id,
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      icon: this.form.icon,
      category: this.form.category,
      steps: this.form.steps.filter((s) => s.label.trim()),
    });
  }
}
