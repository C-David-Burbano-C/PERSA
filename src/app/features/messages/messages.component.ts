import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MessageService } from '../../core/services';
import { MESSAGE_CATEGORIES, MessageCategoryMeta } from '../../core/models';
import { LoveMessageCardComponent } from '../../shared/components/love-message-card/love-message-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [LoveMessageCardComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 class="font-display text-2xl text-lilac-950 sm:text-3xl">Un mensaje para ti</h1>
        <p class="mt-1 text-sm text-lilac-500">Palabras que escribí pensando en ti.</p>
      </div>

      <section class="space-y-3">
        <app-love-message-card [message]="messages.featuredMessage()" />
        <button
          type="button"
          (click)="messages.shuffle()"
          class="mx-auto flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-lilac-500 transition-colors hover:bg-lilac-100 hover:text-lilac-700"
        >
          <app-icon name="sparkle" [size]="14" />
          Otro mensaje
        </button>
      </section>

      <section>
        <h2 class="mb-3 text-base font-semibold text-lilac-900">Abrir cuando necesites un poquito de amor</h2>

        @if (openCategory(); as category) {
          <div class="card-surface animate-pop space-y-4 rounded-2xl p-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-lilac-100 text-lilac-600">
                  <app-icon [name]="category.icon" [size]="17" />
                </span>
                <p class="text-sm font-semibold text-lilac-900">{{ category.label }}</p>
              </div>
              <button type="button" (click)="openCategory.set(null)" class="rounded-lg p-1.5 text-lilac-400 hover:bg-lilac-50 hover:text-lilac-700" aria-label="Cerrar">
                <app-icon name="x" [size]="16" />
              </button>
            </div>

            <div class="space-y-3">
              @for (message of messages.byCategory(category.id); track message.id) {
                <div class="rounded-xl bg-lilac-50/70 p-4">
                  <p class="text-sm font-medium text-lilac-800">{{ message.title }}</p>
                  <p class="mt-1 text-sm leading-relaxed text-lilac-600">{{ message.message }}</p>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="grid gap-3 sm:grid-cols-2">
            @for (category of categories; track category.id) {
              <button
                type="button"
                (click)="openCategory.set(category)"
                class="card-surface group flex items-center gap-3 rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg"
              >
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lilac-100 text-lilac-600 transition-colors group-hover:bg-lilac-600 group-hover:text-white">
                  <app-icon [name]="category.icon" [size]="19" [strokeWidth]="1.7" />
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-lilac-900">{{ category.label }}</p>
                  <p class="truncate text-xs text-lilac-400">{{ category.description }}</p>
                </div>
              </button>
            }
          </div>
        }
      </section>
    </div>
  `,
})
export class MessagesComponent {
  protected readonly messages = inject(MessageService);
  readonly categories = MESSAGE_CATEGORIES;
  readonly openCategory = signal<MessageCategoryMeta | null>(null);
}
