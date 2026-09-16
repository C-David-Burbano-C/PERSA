import { Injectable } from '@angular/core';

const NAMESPACE = 'persa';

/**
 * Envoltorio simple sobre localStorage.
 * Lo centralizo acá para que todos los servicios guarden los datos igual,
 * y si algún día cambio a un backend real solo toco este archivo.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private key(name: string): string {
    return `${NAMESPACE}:${name}`;
  }

  read<T>(name: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(this.key(name));
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  write<T>(name: string, value: T): void {
    try {
      localStorage.setItem(this.key(name), JSON.stringify(value));
    } catch {
      // Si el storage está lleno o no está disponible (modo incógnito),
      // no hago nada y la app sigue funcionando solo en memoria.
    }
  }

  remove(name: string): void {
    try {
      localStorage.removeItem(this.key(name));
    } catch {
      /* noop */
    }
  }

  /** Borra todas las claves "persa" — se usa para el botón de restablecer datos. */
  clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(`${NAMESPACE}:`))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* noop */
    }
  }
}
