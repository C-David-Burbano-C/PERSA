import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { JournalService } from '../../core/services';
import { JournalDraft, JournalEntry, MOODS } from '../../core/models';
import { formatLong } from '../../core/utils/date.util';
import { JournalCardComponent } from '../../shared/components/journal-card/journal-card.component';
import { JournalModalComponent } from '../../shared/components/journal-modal/journal-modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [JournalCardComponent, JournalModalComponent, EmptyStateComponent, ConfirmDialogComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-5xl space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-display text-2xl text-lilac-950 sm:text-3xl">Mis momentos</h1>
          <p class="mt-1 text-sm text-lilac-500">Sube una foto y escribe tu journal de cada día.</p>
        </div>
        <button
          type="button"
          (click)="openNew()"
          class="inline-flex items-center gap-1.5 rounded-xl bg-lilac-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-lilac-700"
        >
          <app-icon name="plus" [size]="16" [strokeWidth]="2.2" />
          Nuevo momento
        </button>
      </div>

      @if (journal.entries().length) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (entry of journal.entries(); track entry.id) {
            <app-journal-card [entry]="entry" (open)="openEdit(entry)" />
          }
        </div>
      } @else {
        <app-empty-state icon="camera" title="Tu álbum está vacío" subtitle="Guarda una fotografía y un pequeño recuerdo de tu día." />
      }
    </div>

    @if (viewing(); as entry) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-lilac-950/40 backdrop-blur-sm" (click)="viewing.set(null)"></div>
        <div class="animate-pop relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-soft-lg">
          <button
            type="button"
            (click)="viewing.set(null)"
            class="absolute right-4 top-4 z-10 rounded-lg bg-white/90 p-1.5 text-lilac-600 hover:bg-white"
            aria-label="Cerrar"
          >
            <app-icon name="x" [size]="16" />
          </button>
          @if (entry.image) {
            <img [src]="entry.image" [alt]="entry.title" class="max-h-80 w-full object-cover" />
          }
          <div class="space-y-3 p-6">
            <div class="flex items-center gap-2 text-xs text-lilac-400">
              <app-icon [name]="moodIcon(entry)" [size]="14" />
              {{ moodLabel(entry) }} · {{ friendlyDate(entry) }}
            </div>
            <h2 class="font-display text-xl text-lilac-950">{{ entry.title }}</h2>
            <p class="text-sm leading-relaxed text-lilac-600">{{ entry.description }}</p>
            @if (entry.tags.length) {
              <div class="flex flex-wrap gap-1.5 pt-1">
                @for (tag of entry.tags; track tag) {
                  <span class="rounded-full bg-lilac-50 px-2.5 py-1 text-xs text-lilac-500">#{{ tag }}</span>
                }
              </div>
            }
            <div class="flex items-center gap-2 pt-2">
              <button type="button" (click)="openEditFromViewer(entry)" class="inline-flex items-center gap-1.5 rounded-xl bg-lilac-100 px-3.5 py-2 text-xs font-medium text-lilac-700 hover:bg-lilac-200">
                <app-icon name="pencil" [size]="13" />
                Editar
              </button>
              <button type="button" (click)="askDelete(entry)" class="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-500 hover:bg-rose-100">
                <app-icon name="trash" [size]="13" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <app-journal-modal [open]="modalOpen()" [entry]="editingEntry()" (close)="closeModal()" (save)="onSave($event)" />

    <app-confirm-dialog
      [open]="entryToDelete() !== null"
      title="¿Eliminar este momento?"
      message="La fotografía y el texto se perderán."
      (cancel)="entryToDelete.set(null)"
      (confirm)="confirmDelete()"
    />
  `,
})
export class JournalComponent {
  protected readonly journal = inject(JournalService);

  readonly viewing = signal<JournalEntry | null>(null);
  readonly modalOpen = signal(false);
  readonly editingEntry = signal<JournalEntry | null>(null);
  readonly entryToDelete = signal<JournalEntry | null>(null);

  moodIcon(entry: JournalEntry): string {
    return MOODS.find((m) => m.id === entry.mood)?.icon ?? 'smile';
  }

  moodLabel(entry: JournalEntry): string {
    return MOODS.find((m) => m.id === entry.mood)?.label ?? '';
  }

  friendlyDate(entry: JournalEntry): string {
    return formatLong(entry.date);
  }

  openNew(): void {
    this.editingEntry.set(null);
    this.modalOpen.set(true);
  }

  openEdit(entry: JournalEntry): void {
    this.viewing.set(entry);
  }

  openEditFromViewer(entry: JournalEntry): void {
    this.viewing.set(null);
    this.editingEntry.set(entry);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  askDelete(entry: JournalEntry): void {
    this.viewing.set(null);
    this.entryToDelete.set(entry);
  }

  confirmDelete(): void {
    const entry = this.entryToDelete();
    if (entry) this.journal.remove(entry.id);
    this.entryToDelete.set(null);
  }

  onSave(event: { id?: string; draft: JournalDraft }): void {
    if (event.id) {
      this.journal.update(event.id, event.draft);
    } else {
      this.journal.add(event.draft);
    }
    this.closeModal();
  }
}
