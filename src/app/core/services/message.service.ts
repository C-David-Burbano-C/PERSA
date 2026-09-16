import { Injectable, computed, signal } from '@angular/core';
import { LoveMessage, MessageCategory } from '../models';
import { createId } from '../utils/id.util';

const LOVE_MESSAGES: LoveMessage[] = [
  { id: createId(), title: 'Para un día triste', message: 'No tienes que tener todo resuelto para estar haciendo las cosas bien.', category: 'triste' },
  { id: createId(), title: 'Está bien no poder con todo', message: 'Si hoy no pudiste con todo, no pasa nada. Mañana puedes intentarlo otra vez.', category: 'triste' },
  { id: createId(), title: 'Respira', message: 'Está bien parar un momento. Yo te espero, sin prisa.', category: 'dia-dificil' },
  { id: createId(), title: 'Un día difícil', message: 'Los días difíciles también pasan. Y en los tuyos, quiero estar cerca.', category: 'dia-dificil' },
  { id: createId(), title: 'Lo lograste', message: 'Me gusta verte cumplir incluso esas pequeñas metas que te propones.', category: 'logro' },
  { id: createId(), title: 'Orgulloso de ti', message: 'Estoy orgulloso de ti, incluso de esas pequeñas cosas que quizá tú no notas.', category: 'logro' },
  { id: createId(), title: 'Un empujoncito', message: 'Puedes con esto. Y si no puedes hoy, lo intentamos juntas mañana.', category: 'motivacion' },
  { id: createId(), title: 'Un paso a la vez', message: 'No tienes que hacerlo todo hoy. Un pequeño paso también cuenta.', category: 'motivacion' },
  { id: createId(), title: 'Porque sí', message: 'Sin ningún motivo en especial: te quiero, y hoy quería recordártelo.', category: 'porque-si' },
  { id: createId(), title: 'Solo porque pensé en ti', message: 'Estaba pensando en ti y quería que lo supieras.', category: 'porque-si' },
];

const DAILY_PHRASES = [
  'No tienes que hacerlo todo hoy. Un pequeño paso también cuenta.',
  'Ir despacio también es avanzar.',
  'Hoy puede ser un día tranquilo, y está bien.',
  'Lo que hagas hoy, hazlo con calma.',
  'Un poquito de orden también es cuidarte.',
  'No necesitas terminarlo todo para que el día haya valido la pena.',
  'Está bien si hoy solo puedes con lo pequeño.',
];

const DAILY_NOTES = [
  'Estoy orgulloso de ti, incluso de esas pequeñas cosas que quizá tú no notas.',
  'Cada paso que das, aunque sea chiquito, yo lo veo.',
  'Quiero acompañarte en esto, no solo verte desde lejos.',
  'Hiciste este espacio tuyo, y eso ya es bonito.',
  'Sea cual sea tu ritmo hoy, está bien.',
];

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly shuffleSeed = signal(0);

  readonly messages = signal<LoveMessage[]>(LOVE_MESSAGES);

  readonly dailyPhrase = computed(() => DAILY_PHRASES[dayOfYear() % DAILY_PHRASES.length]);
  readonly dailyNote = computed(() => DAILY_NOTES[dayOfYear() % DAILY_NOTES.length]);

  /** Cambia cada vez que se llama a shuffle() — para elegir un mensaje distinto del día. */
  readonly featuredMessage = computed(() => {
    const pool = this.messages();
    const index = (dayOfYear() + this.shuffleSeed()) % pool.length;
    return pool[index];
  });

  shuffle(): void {
    this.shuffleSeed.update((n) => n + 1 + Math.floor(Math.random() * this.messages().length));
  }

  byCategory(category: MessageCategory): LoveMessage[] {
    return this.messages().filter((m) => m.category === category);
  }
}
