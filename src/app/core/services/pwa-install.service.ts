import { Injectable, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function detectStandalone(): boolean {
  const mql = typeof window !== 'undefined' ? window.matchMedia?.('(display-mode: standalone)') : null;
  const iosStandalone = typeof navigator !== 'undefined' && (navigator as unknown as { standalone?: boolean }).standalone;
  return Boolean(mql?.matches || iosStandalone);
}

function detectIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * Se encarga de todo lo de "instalar como app": guarda el evento que manda
 * el navegador (beforeinstallprompt), sabe si ya está instalada y si
 * estamos en iOS (ahí no hay prompt nativo, hay que guiar a la persona a
 * usar "Compartir > Agregar a inicio").
 */
@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  readonly canInstall = signal(false);
  readonly isStandalone = signal(detectStandalone());
  readonly isIos = signal(detectIos());

  constructor() {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.canInstall.set(false);
      this.isStandalone.set(true);
    });
  }

  async promptInstall(): Promise<void> {
    if (!this.deferredPrompt) return;
    await this.deferredPrompt.prompt();
    await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.canInstall.set(false);
  }
}
