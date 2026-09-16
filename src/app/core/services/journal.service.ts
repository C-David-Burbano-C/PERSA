import { Injectable, computed, effect, signal } from '@angular/core';
import { JournalDraft, JournalEntry } from '../models';
import { createId } from '../utils/id.util';
import { addDays, todayIso } from '../utils/date.util';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'journal';

function seedEntries(): JournalEntry[] {
  const today = todayIso();
  return [
    {
      id: createId(),
      title: 'Un día bonito',
      description: 'Hoy fue un día bastante tranquilo. Me gustó mucho este momento contigo.',
      date: addDays(today, -2),
      mood: 'feliz',
      tags: ['nosotros', 'tranquilidad'],
      createdAt: new Date().toISOString(),
    },
    {
      id: createId(),
      title: 'Pequeña victoria',
      description: 'Terminé algo que me tenía estresada y me sentí muy orgullosa de mí misma.',
      date: addDays(today, -6),
      mood: 'agradecida',
      tags: ['logros'],
      createdAt: new Date().toISOString(),
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class JournalService {
  private readonly state = signal<JournalEntry[]>([]);

  readonly entries = computed(() => [...this.state()].sort((a, b) => (a.date < b.date ? 1 : -1)));

  constructor(private readonly storage: StorageService) {
    const stored = this.storage.read<JournalEntry[] | null>(STORAGE_KEY, null);
    this.state.set(stored === null ? seedEntries() : stored);

    effect(() => {
      this.storage.write(STORAGE_KEY, this.state());
    });
  }

  getById(id: string): JournalEntry | undefined {
    return this.state().find((e) => e.id === id);
  }

  add(draft: JournalDraft): JournalEntry {
    const entry: JournalEntry = { ...draft, id: createId(), createdAt: new Date().toISOString() };
    this.state.update((entries) => [...entries, entry]);
    return entry;
  }

  update(id: string, changes: Partial<JournalDraft>): void {
    this.state.update((entries) => entries.map((e) => (e.id === id ? { ...e, ...changes } : e)));
  }

  remove(id: string): void {
    this.state.update((entries) => entries.filter((e) => e.id !== id));
  }

  /** Borra todas las entradas del journal — se usa para limpiar los datos de ejemplo. */
  clearAll(): void {
    this.state.set([]);
  }
}
