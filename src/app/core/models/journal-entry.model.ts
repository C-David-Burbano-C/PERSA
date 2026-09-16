export type Mood = 'feliz' | 'tranquila' | 'agradecida' | 'cansada' | 'triste' | 'emocionada';

export interface MoodMeta {
  id: Mood;
  label: string;
  icon: string;
}

export const MOODS: MoodMeta[] = [
  { id: 'feliz', label: 'Feliz', icon: 'smile' },
  { id: 'tranquila', label: 'Tranquila', icon: 'leaf' },
  { id: 'agradecida', label: 'Agradecida', icon: 'heart' },
  { id: 'cansada', label: 'Cansada', icon: 'moon' },
  { id: 'triste', label: 'Un poco triste', icon: 'cloud-rain' },
  { id: 'emocionada', label: 'Emocionada', icon: 'sparkle' },
];

export interface JournalEntry {
  id: string;
  title: string;
  description: string;
  /** data URL de la foto, es opcional */
  image?: string;
  date: string;
  mood: Mood;
  tags: string[];
  createdAt: string;
}

export type JournalDraft = Omit<JournalEntry, 'id' | 'createdAt'>;
