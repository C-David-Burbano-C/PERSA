/** Categorías que se usan tanto en tareas como en metas. */
export type CategoryId =
  | 'estudios'
  | 'trabajo'
  | 'casa'
  | 'personal'
  | 'nosotros'
  | 'bienestar'
  | 'hobbies'
  | 'otros';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: string;
  /** Clases de color de Tailwind para badges, acentos y los puntos del calendario. */
  bg: string;
  text: string;
  ring: string;
  dot: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'estudios', label: 'Estudios', icon: 'book-open', bg: 'bg-lilac-100', text: 'text-lilac-700', ring: 'ring-lilac-200', dot: 'bg-lilac-500' },
  { id: 'trabajo', label: 'Trabajo', icon: 'briefcase', bg: 'bg-lavender-100', text: 'text-lilac-700', ring: 'ring-lavender-200', dot: 'bg-lilac-600' },
  { id: 'casa', label: 'Casa', icon: 'home', bg: 'bg-blush-100', text: 'text-blush-400', ring: 'ring-blush-200', dot: 'bg-blush-400' },
  { id: 'personal', label: 'Personal', icon: 'sparkle', bg: 'bg-lilac-100', text: 'text-lilac-700', ring: 'ring-lilac-200', dot: 'bg-lilac-700' },
  { id: 'nosotros', label: 'Nosotros', icon: 'heart', bg: 'bg-blush-100', text: 'text-blush-400', ring: 'ring-blush-200', dot: 'bg-blush-300' },
  { id: 'bienestar', label: 'Bienestar', icon: 'flower', bg: 'bg-lavender-100', text: 'text-lilac-700', ring: 'ring-lavender-200', dot: 'bg-lilac-400' },
  { id: 'hobbies', label: 'Hobbies', icon: 'palette', bg: 'bg-lilac-100', text: 'text-lilac-700', ring: 'ring-lilac-200', dot: 'bg-lilac-800' },
  { id: 'otros', label: 'Otros', icon: 'star', bg: 'bg-lilac-50', text: 'text-lilac-600', ring: 'ring-lilac-200', dot: 'bg-lilac-950' },
];

export function categoryMeta(id: CategoryId): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
