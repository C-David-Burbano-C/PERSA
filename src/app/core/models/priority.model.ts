export type Priority = 'baja' | 'media' | 'alta';

export interface PriorityMeta {
  id: Priority;
  label: string;
  dot: string;
  text: string;
  bg: string;
}

export const PRIORITIES: Record<Priority, PriorityMeta> = {
  baja: { id: 'baja', label: 'Prioridad baja', dot: 'bg-emerald-400', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  media: { id: 'media', label: 'Prioridad media', dot: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' },
  alta: { id: 'alta', label: 'Prioridad alta', dot: 'bg-rose-400', text: 'text-rose-600', bg: 'bg-rose-50' },
};
