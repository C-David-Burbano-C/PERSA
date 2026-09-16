export type MessageCategory = 'triste' | 'dia-dificil' | 'logro' | 'motivacion' | 'porque-si';

export interface MessageCategoryMeta {
  id: MessageCategory;
  label: string;
  description: string;
  icon: string;
}

export const MESSAGE_CATEGORIES: MessageCategoryMeta[] = [
  { id: 'triste', label: 'Cuando estés triste', description: 'Para esos días grises', icon: 'heart' },
  { id: 'dia-dificil', label: 'Cuando tengas un día difícil', description: 'Un respiro en medio del caos', icon: 'moon' },
  { id: 'logro', label: 'Cuando hayas logrado algo', description: 'Para celebrar contigo', icon: 'sparkle' },
  { id: 'motivacion', label: 'Cuando necesites motivación', description: 'Un empujoncito con cariño', icon: 'hand-heart' },
  { id: 'porque-si', label: 'Cuando simplemente quieras saber que te quiero', description: 'Sin motivo, solo porque sí', icon: 'mail' },
];

export interface LoveMessage {
  id: string;
  title: string;
  message: string;
  category: MessageCategory;
}
