/** Funciones de fecha que uso en toda la app. Las fechas se guardan como texto ISO 'YYYY-MM-DD'. */

export function todayIso(): string {
  return toIso(new Date());
}

export function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(iso: string, amount: number): string {
  const date = fromIso(iso);
  date.setDate(date.getDate() + amount);
  return toIso(date);
}

export function isSameMonth(iso: string, reference: Date): boolean {
  const d = fromIso(iso);
  return d.getFullYear() === reference.getFullYear() && d.getMonth() === reference.getMonth();
}

export function isPast(iso: string): boolean {
  return fromIso(iso) < fromIso(todayIso());
}

const WEEKDAY_LABELS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTH_LABELS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function formatFriendly(iso: string): string {
  const date = fromIso(iso);
  const today = todayIso();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);
  if (iso === today) return 'Hoy';
  if (iso === tomorrow) return 'Mañana';
  if (iso === yesterday) return 'Ayer';
  return `${date.getDate()} de ${MONTH_LABELS[date.getMonth()]}`;
}

export function formatLong(iso: string): string {
  const date = fromIso(iso);
  return `${date.getDate()} de ${MONTH_LABELS[date.getMonth()]}, ${date.getFullYear()}`;
}

export function weekdayShort(iso: string): string {
  return WEEKDAY_LABELS[fromIso(iso).getDay()];
}

export function monthLabel(date: Date): string {
  return `${MONTH_LABELS[date.getMonth()][0].toUpperCase()}${MONTH_LABELS[date.getMonth()].slice(1)} ${date.getFullYear()}`;
}

/** Arma una cuadrícula de 6x7 fechas con las semanas completas del mes recibido. */
export function buildMonthGrid(reference: Date): string[] {
  const firstOfMonth = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const startOffset = firstOfMonth.getDay(); // 0=Sun
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return toIso(d);
  });
}

export function startOfWeek(iso: string): string {
  const date = fromIso(iso);
  date.setDate(date.getDate() - date.getDay());
  return toIso(date);
}

export function weekDates(iso: string): string[] {
  const start = startOfWeek(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
