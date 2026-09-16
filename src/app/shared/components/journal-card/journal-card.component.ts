import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { JournalEntry, MOODS } from '../../../core/models';
import { formatLong } from '../../../core/utils/date.util';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-journal-card',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card-surface animate-fade-up group flex cursor-pointer flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg"
      (click)="open.emit()"
    >
      @if (entry().image) {
        <div class="aspect-[4/3] w-full overflow-hidden bg-lilac-100">
          <img [src]="entry().image" [alt]="entry().title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      } @else {
        <div class="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-lilac-100 to-lavender-100 text-lilac-300">
          <app-icon name="image" [size]="34" [strokeWidth]="1.3" />
        </div>
      }

      <div class="flex flex-1 flex-col gap-2 p-4">
        <div class="flex items-center justify-between gap-2">
          <h3 class="truncate text-sm font-semibold text-lilac-950">{{ entry().title }}</h3>
          <span class="flex shrink-0 items-center gap-1 rounded-full bg-lilac-50 px-2 py-0.5 text-[11px] text-lilac-500">
            <app-icon [name]="moodIcon()" [size]="12" />
            {{ moodLabel() }}
          </span>
        </div>
        <p class="line-clamp-2 text-xs text-lilac-500">{{ entry().description }}</p>
        <p class="mt-auto pt-1 text-[11px] text-lilac-400">{{ friendlyDate() }}</p>
      </div>
    </article>
  `,
})
export class JournalCardComponent {
  readonly entry = input.required<JournalEntry>();
  readonly open = output<void>();

  readonly friendlyDate = computed(() => formatLong(this.entry().date));
  readonly moodMeta = computed(() => MOODS.find((m) => m.id === this.entry().mood) ?? MOODS[0]);
  readonly moodIcon = computed(() => this.moodMeta().icon);
  readonly moodLabel = computed(() => this.moodMeta().label);
}
