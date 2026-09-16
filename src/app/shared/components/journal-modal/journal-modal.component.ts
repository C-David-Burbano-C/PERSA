import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JournalDraft, JournalEntry, MOODS, Mood } from '../../../core/models';
import { todayIso } from '../../../core/utils/date.util';
import { IconComponent } from '../icon/icon.component';

interface JournalFormState {
  title: string;
  description: string;
  date: string;
  mood: Mood;
  tagsText: string;
  image?: string;
}

function blankState(): JournalFormState {
  return { title: '', description: '', date: todayIso(), mood: 'feliz', tagsText: '', image: undefined };
}

@Component({
  selector: 'app-journal-modal',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <div class="absolute inset-0 bg-lilac-950/30 backdrop-blur-sm" (click)="close.emit()"></div>

        <div class="animate-pop relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-soft-lg sm:rounded-3xl">
          <header class="flex shrink-0 items-center justify-between border-b border-lilac-100 px-5 py-4 sm:px-6">
            <h2 class="text-base font-semibold text-lilac-950 sm:text-lg">{{ entry() ? 'Editar momento' : 'Nuevo momento' }}</h2>
            <button type="button" (click)="close.emit()" class="rounded-lg p-1.5 text-lilac-400 hover:bg-lilac-50 hover:text-lilac-700" aria-label="Cerrar">
              <app-icon name="x" [size]="18" />
            </button>
          </header>

          <div class="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Fotografía (opcional)</label>
              @if (form.image) {
                <div class="relative mb-2 overflow-hidden rounded-xl">
                  <img [src]="form.image" alt="" class="h-40 w-full object-cover" />
                  <button
                    type="button"
                    (click)="form.image = undefined"
                    class="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-lilac-600 hover:bg-white"
                    aria-label="Quitar fotografía"
                  >
                    <app-icon name="x" [size]="14" />
                  </button>
                </div>
              } @else {
                <label
                  class="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-lilac-300 bg-lilac-50/50 py-8 text-lilac-400 transition-colors hover:bg-lilac-50"
                >
                  <app-icon name="camera" [size]="22" [strokeWidth]="1.5" />
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
                placeholder="Ej. Un día bonito"
                class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Escribe un poco</label>
              <textarea
                [(ngModel)]="form.description"
                rows="3"
                placeholder="¿Cómo fue este momento?"
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

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">¿Cómo te sentías?</label>
              <div class="flex flex-wrap gap-2">
                @for (m of moods; track m.id) {
                  <button
                    type="button"
                    (click)="form.mood = m.id"
                    class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                    [class]="form.mood === m.id ? 'border-transparent bg-lilac-600 text-white' : 'border-lilac-200 text-lilac-500 hover:bg-lilac-50'"
                  >
                    <app-icon [name]="m.icon" [size]="12" />
                    {{ m.label }}
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-lilac-500">Etiquetas (separadas por coma)</label>
              <input
                type="text"
                [(ngModel)]="form.tagsText"
                placeholder="nosotros, tranquilidad"
                class="w-full rounded-xl border border-lilac-200 bg-lilac-50/50 px-3.5 py-2.5 text-sm text-lilac-950 outline-none focus:border-lilac-400 focus:bg-white"
              />
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
              {{ entry() ? 'Guardar cambios' : 'Guardar momento' }}
            </button>
          </footer>
        </div>
      </div>
    }
  `,
})
export class JournalModalComponent {
  readonly open = input<boolean>(false);
  readonly entry = input<JournalEntry | null>(null);

  readonly close = output<void>();
  readonly save = output<{ id?: string; draft: JournalDraft }>();

  readonly moods = MOODS;
  form: JournalFormState = blankState();

  constructor() {
    effect(() => {
      const entry = this.entry();
      if (!this.open()) return;
      this.form = entry
        ? {
            title: entry.title,
            description: entry.description,
            date: entry.date,
            mood: entry.mood,
            tagsText: entry.tags.join(', '),
            image: entry.image,
          }
        : blankState();
    });
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

  submit(): void {
    if (!this.form.title.trim()) return;
    const draft: JournalDraft = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      date: this.form.date || todayIso(),
      mood: this.form.mood,
      tags: this.form.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      image: this.form.image,
    };
    this.save.emit({ id: this.entry()?.id, draft });
  }
}
