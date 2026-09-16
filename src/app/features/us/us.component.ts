import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemoryService } from '../../core/services';
import { CoupleMemory, CoupleMemoryDraft } from '../../core/models';
import { formatLong, todayIso } from '../../core/utils/date.util';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface MemoryFormState {
  title: string;
  description: string;
  date: string;
  image?: string;
}

function blankState(): MemoryFormState {
  return { title: '', description: '', date: todayIso(), image: undefined };
}

@Component({
  selector: 'app-us',
  standalone: true,
  imports: [FormsModule, EmptyStateComponent, ConfirmDialogComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 class="font-display text-2xl text-lilac-950 sm:text-3xl">Nosotros</h1>
        <p class="mt-1 text-sm text-lilac-500">Nuestros recuerdos, planes y pequeñas notas.</p>
      </div>

      <section>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-base font-semibold text-lilac-900">Próximamente</h2>
          <button type="button" (click)="addingPlan.set(!addingPlan())" class="text-sm font-medium text-lilac-600 hover:underline">
            + Añadir plan
          </button>
        </div>

        @if (addingPlan()) {
          <div class="mb-3 flex items-center gap-2">
            <input
              type="text"
              [(ngModel)]="newPlanTitle"
              placeholder="Ej. Ver el atardecer juntos"
              (keyup.enter)="submitPlan()"
              class="flex-1 rounded-xl border border-lilac-200 bg-white px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400"
            />
            <button type="button" (click)="submitPlan()" class="rounded-xl bg-lilac-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-lilac-700">
              Añadir
            </button>
          </div>
        }

        @if (memories.plans().length) {
          <div class="grid gap-2.5 sm:grid-cols-2">
            @for (plan of memories.plans(); track plan.id) {
              <div class="card-surface flex items-center gap-3 rounded-xl p-3.5">
                <button
                  type="button"
                  (click)="memories.togglePlan(plan.id)"
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"
                  [class]="plan.done ? 'border-lilac-600 bg-lilac-600 text-white' : 'border-lilac-300 text-transparent'"
                >
                  <app-icon name="check" [size]="13" [strokeWidth]="2.6" />
                </button>
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lilac-100 text-lilac-600">
                  <app-icon [name]="plan.icon" [size]="15" />
                </span>
                <p class="min-w-0 flex-1 truncate text-sm font-medium text-lilac-800" [class.line-through]="plan.done" [class.text-lilac-400]="plan.done">
                  {{ plan.title }}
                </p>
                <button type="button" (click)="memories.removePlan(plan.id)" class="shrink-0 rounded-lg p-1.5 text-lilac-300 hover:bg-rose-50 hover:text-rose-500">
                  <app-icon name="x" [size]="13" />
                </button>
              </div>
            }
          </div>
        } @else {
          <app-empty-state icon="heart" title="Sin planes todavía" subtitle="Agrega algo lindo que quieran hacer juntos." />
        }
      </section>

      <section>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-base font-semibold text-lilac-900">Nuestros recuerdos</h2>
          <button
            type="button"
            (click)="openNewMemory()"
            class="inline-flex items-center gap-1.5 rounded-xl bg-lilac-600 px-3.5 py-2 text-xs font-semibold text-white shadow-soft hover:bg-lilac-700"
          >
            <app-icon name="plus" [size]="14" [strokeWidth]="2.2" />
            Nuevo recuerdo
          </button>
        </div>

        @if (memories.memories().length) {
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (memory of memories.memories(); track memory.id) {
              <article class="card-surface group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg">
                @if (memory.image) {
                  <div class="aspect-[4/3] w-full overflow-hidden bg-lilac-100">
                    <img [src]="memory.image" [alt]="memory.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                } @else {
                  <div class="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-lilac-100 to-blush-100 text-lilac-300">
                    <app-icon name="heart-fill" [size]="30" />
                  </div>
                }
                <div class="space-y-1.5 p-4">
                  <div class="flex items-center justify-between gap-2">
                    <h3 class="truncate text-sm font-semibold text-lilac-950">{{ memory.title }}</h3>
                    <button type="button" (click)="askDelete(memory)" class="shrink-0 rounded-lg p-1 text-lilac-300 hover:bg-rose-50 hover:text-rose-500">
                      <app-icon name="trash" [size]="13" />
                    </button>
                  </div>
                  <p class="line-clamp-2 text-xs text-lilac-500">{{ memory.description }}</p>
                  <p class="pt-0.5 text-[11px] text-lilac-400">{{ friendlyDate(memory) }}</p>
                </div>
              </article>
            }
          </div>
        } @else {
          <app-empty-state icon="camera" title="Aún no hay recuerdos guardados" subtitle="Guarda esos momentos que quieren recordar juntos." />
        }
      </section>
    </div>

    @if (modalOpen()) {
      <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div class="absolute inset-0 bg-lilac-950/30 backdrop-blur-sm" (click)="modalOpen.set(false)"></div>
        <div class="animate-pop relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-soft-lg sm:rounded-3xl">
          <header class="flex shrink-0 items-center justify-between border-b border-lilac-100 px-5 py-4 sm:px-6">
            <h2 class="text-base font-semibold text-lilac-950 sm:text-lg">Nuevo recuerdo</h2>
            <button type="button" (click)="modalOpen.set(false)" class="rounded-lg p-1.5 text-lilac-400 hover:bg-lilac-50 hover:text-lilac-700">
              <app-icon name="x" [size]="18" />
            </button>
          </header>
          <div class="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Fotografía (opcional)</label>
              @if (form.image) {
                <div class="relative mb-2 overflow-hidden rounded-xl">
                  <img [src]="form.image" alt="" class="h-36 w-full object-cover" />
                  <button type="button" (click)="form.image = undefined" class="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-lilac-600 hover:bg-white">
                    <app-icon name="x" [size]="14" />
                  </button>
                </div>
              } @else {
                <label class="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-lilac-300 bg-lilac-50/50 py-7 text-lilac-400 hover:bg-lilac-50">
                  <app-icon name="camera" [size]="20" [strokeWidth]="1.5" />
                  <span class="text-xs">Toca para elegir una foto</span>
                  <input type="file" accept="image/*" class="hidden" (change)="onFile($event)" />
                </label>
              }
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Título</label>
              <input
                type="text"
                [(ngModel)]="form.title"
                placeholder="Ej. Nuestra primera cita"
                class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Descripción</label>
              <textarea
                [(ngModel)]="form.description"
                rows="3"
                placeholder="¿Qué hace especial este recuerdo?"
                class="w-full resize-none rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              ></textarea>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Fecha</label>
              <input
                type="date"
                [(ngModel)]="form.date"
                class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              />
            </div>
          </div>
          <footer class="flex shrink-0 items-center justify-end gap-2 border-t border-lilac-100 px-5 py-4 sm:px-6">
            <button type="button" (click)="modalOpen.set(false)" class="rounded-xl px-4 py-2.5 text-sm font-medium text-lilac-600 hover:bg-lilac-50">
              Cancelar
            </button>
            <button
              type="button"
              [disabled]="!form.title.trim()"
              (click)="submitMemory()"
              class="rounded-xl bg-lilac-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-lilac-700 disabled:cursor-not-allowed disabled:bg-lilac-200"
            >
              Guardar recuerdo
            </button>
          </footer>
        </div>
      </div>
    }

    <app-confirm-dialog
      [open]="memoryToDelete() !== null"
      title="¿Eliminar este recuerdo?"
      message="Esta acción no se puede deshacer."
      (cancel)="memoryToDelete.set(null)"
      (confirm)="confirmDelete()"
    />
  `,
})
export class UsComponent {
  protected readonly memories = inject(MemoryService);

  readonly addingPlan = signal(false);
  newPlanTitle = '';

  readonly modalOpen = signal(false);
  readonly memoryToDelete = signal<CoupleMemory | null>(null);
  form: MemoryFormState = blankState();

  friendlyDate(memory: CoupleMemory): string {
    return formatLong(memory.date);
  }

  submitPlan(): void {
    if (!this.newPlanTitle.trim()) return;
    this.memories.addPlan({ title: this.newPlanTitle.trim(), icon: 'heart' });
    this.newPlanTitle = '';
    this.addingPlan.set(false);
  }

  openNewMemory(): void {
    this.form = blankState();
    this.modalOpen.set(true);
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submitMemory(): void {
    if (!this.form.title.trim()) return;
    const draft: CoupleMemoryDraft = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      date: this.form.date || todayIso(),
      image: this.form.image,
    };
    this.memories.addMemory(draft);
    this.modalOpen.set(false);
  }

  askDelete(memory: CoupleMemory): void {
    this.memoryToDelete.set(memory);
  }

  confirmDelete(): void {
    const memory = this.memoryToDelete();
    if (memory) this.memories.removeMemory(memory.id);
    this.memoryToDelete.set(null);
  }
}
