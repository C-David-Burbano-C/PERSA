/**
 * Íconos SVG dibujados a mano (viewBox 24x24). Nada de emojis ni de
 * fuentes/imágenes externas — todos salen de este registro.
 * Cada entrada es el contenido *interno* de un <svg>; el tag <svg> de
 * afuera, con tamaño, trazo y relleno, lo pone IconComponent.
 */
export const ICONS: Record<string, string> = {
  // Navegación
  home: `<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.3V20h12v-9.7"/><path d="M10 20v-5.5h4V20"/>`,
  'check-square': `<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M7.5 12.2 10.3 15 16.5 8.7"/>`,
  calendar: `<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18"/><path d="M8 2.5v4"/><path d="M16 2.5v4"/>`,
  target: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>`,
  camera: `<rect x="3" y="6.2" width="18" height="13.3" rx="2.5"/><path d="M8 6.2 9.3 4a1.8 1.8 0 0 1 1.5-.8h2.4a1.8 1.8 0 0 1 1.5.8l1.3 2.2"/><circle cx="12" cy="13" r="3.4"/>`,
  gift: `<rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3 13.2h18"/><path d="M12 9v11"/><circle cx="9" cy="6.4" r="2.1"/><circle cx="15" cy="6.4" r="2.1"/>`,
  'mail-heart': `<rect x="3" y="6" width="18" height="14" rx="2.2"/><path d="M4 7l8 6.5L20 7"/><path d="M16.2 3.4c1-.9 2.7-.2 2.7 1.1 0 1-.9 1.8-2.7 2.7-1.8-.9-2.7-1.7-2.7-2.7 0-1.3 1.7-2 2.7-1.1Z" fill="currentColor" stroke="none"/>`,
  heart: `<path d="M12 20.2S4.8 15.6 2.3 10.9C.7 8 2.6 4.5 6 4.5c2 0 3.6 1.1 6 3.7 2.4-2.6 4-3.7 6-3.7 3.4 0 5.3 3.5 3.7 6.4-2.5 4.7-9.7 9.3-9.7 9.3Z"/>`,
  'heart-fill': `<path d="M12 20.2S4.8 15.6 2.3 10.9C.7 8 2.6 4.5 6 4.5c2 0 3.6 1.1 6 3.7 2.4-2.6 4-3.7 6-3.7 3.4 0 5.3 3.5 3.7 6.4-2.5 4.7-9.7 9.3-9.7 9.3Z" fill="currentColor" stroke="none"/>`,
  menu: `<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>`,

  // Categorías
  'book-open': `<path d="M4 5.8c2.2-1.1 5.2-1 7 .5v13c-1.8-1.5-4.8-1.6-7-.5Z"/><path d="M20 5.8c-2.2-1.1-5.2-1-7 .5v13c1.8-1.5 4.8-1.6 7-.5Z"/>`,
  briefcase: `<rect x="3.5" y="8" width="17" height="11" rx="2"/><path d="M8.5 8V6.3a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V8"/><path d="M3.5 13.3h17"/>`,
  sparkle: `<path d="M12 2.6c.7 3.6 2.1 5 5.6 5.7-3.5.7-4.9 2.1-5.6 5.7-.7-3.6-2.1-5-5.6-5.7 3.5-.7 4.9-2.1 5.6-5.7Z" fill="currentColor" stroke="none"/><path d="M18.5 14.5c.3 1.6 1 2.3 2.6 2.6-1.6.3-2.3 1-2.6 2.6-.3-1.6-1-2.3-2.6-2.6 1.6-.3 2.3-1 2.6-2.6Z" fill="currentColor" stroke="none"/>`,
  flower: `<circle cx="12" cy="7.6" r="2.6"/><circle cx="12" cy="16.4" r="2.6"/><circle cx="7.6" cy="12" r="2.6"/><circle cx="16.4" cy="12" r="2.6"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>`,
  palette: `<path d="M12 3a9 9 0 1 0 3.5 17.3c1-.4 1-1.8 0-2.4-.6-.4-.8-1.2-.3-1.8.3-.4.8-.6 1.3-.6H18a3.5 3.5 0 0 0 3.5-3.5C21.5 6.8 17.3 3 12 3Z"/><circle cx="7.7" cy="10.6" r="1.1" fill="currentColor" stroke="none"/><circle cx="10.8" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.2" cy="7.4" r="1.1" fill="currentColor" stroke="none"/><circle cx="17.3" cy="11.6" r="1.1" fill="currentColor" stroke="none"/>`,
  star: `<path d="M12 3.6 14.4 9l5.6.6-4.2 3.8.9 5.6L12 16.2 7.3 19l.9-5.6L4 9.6 9.6 9Z"/>`,
  'star-fill': `<path d="M12 3.6 14.4 9l5.6.6-4.2 3.8.9 5.6L12 16.2 7.3 19l.9-5.6L4 9.6 9.6 9Z" fill="currentColor" stroke="none"/>`,

  // Tareas y metas
  clock: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.3V12l3.1 2"/>`,
  tag: `<path d="M11.3 3.3H4.4v6.9l9.7 9.7a2 2 0 0 0 2.8 0l4.7-4.7a2 2 0 0 0 0-2.8Z"/><circle cx="7.7" cy="7.7" r="1.3" fill="currentColor" stroke="none"/>`,
  flame: `<path d="M12 2.8c1.1 3 .1 4.4-1.2 6-1.6 1.9-2.3 3.4-2.3 5A5.5 5.5 0 1 0 19 12c-.3-1.2-1.1-2-1.8-1.5.3 1.7-.5 2.9-1.7 2.9-1.5 0-2.2-1.3-1.7-2.8.8-2.2-.2-5.6-1.8-7.8Z"/>`,
  image: `<rect x="3" y="4.5" width="18" height="15" rx="2.2"/><circle cx="8.3" cy="9.5" r="1.8"/><path d="M4 17.3l5-5 3.2 3.2 2.6-2.6L21 17.3"/>`,
  moon: `<path d="M20.2 14.7A8.5 8.5 0 1 1 9.3 3.8a7.2 7.2 0 0 0 10.9 10.9Z"/>`,
  'cloud-rain': `<path d="M7 14.6a4.4 4.4 0 0 1 .4-8.8 6 6 0 0 1 11.4 2.2 4 4 0 0 1-.8 7.9H7Z"/><path d="M8.5 18v2.3"/><path d="M12.3 18v2.3"/><path d="M16 18v2.3"/>`,
  smile: `<circle cx="12" cy="12" r="8.5"/><path d="M8.2 13.6c1 1.4 2.3 2.1 3.8 2.1s2.8-.7 3.8-2.1"/><circle cx="9" cy="10.1" r=".9" fill="currentColor" stroke="none"/><circle cx="15" cy="10.1" r=".9" fill="currentColor" stroke="none"/>`,
  leaf: `<path d="M5.2 19C13 20 18 15 19 5 9 6 4.2 11 5.2 19Z"/><path d="M5.2 19c3-5 6-8.2 10.3-10.4"/>`,
  'hand-heart': `<path d="M3.5 13.2h4.1l3 1c1.4.5 3 .3 4.2-.5l4-2.7" /><path d="M3.5 19.4h4.4c.6 0 1.2.1 1.7.4l1.4.6c1.3.5 2.8.4 4-.4l6-4a1.7 1.7 0 0 0-1.9-2.8l-3.6 1.9"/><path d="M13.8 5.4c.8-1.4 2.9-1.6 3.9-.3.9 1.1.6 2.6-.6 3.7-.9.8-2 1.4-3.3 2-1.1-.8-2-1.5-2.6-2.4-.8-1.2-.5-2.7.6-3.4 1-.6 1.9-.2 2 .4Z" fill="currentColor" stroke="none"/>`,
  mail: `<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M4 6.8 12 13l8-6.2"/>`,

  // Recompensas
  clapperboard: `<rect x="3.5" y="9.2" width="17" height="10.8" rx="1.6"/><path d="M3.7 9.2 4.9 4.9 19.6 7 18.4 9.2Z"/>`,
  'ice-cream': `<circle cx="12" cy="9" r="4.3"/><path d="M9 12.4h6l-2.3 7.8a1 1 0 0 1-1.4 0Z"/>`,
  sparkles: `<path d="M12 2.6c.7 3.6 2.1 5 5.6 5.7-3.5.7-4.9 2.1-5.6 5.7-.7-3.6-2.1-5-5.6-5.7 3.5-.7 4.9-2.1 5.6-5.7Z" fill="currentColor" stroke="none"/><path d="M5.2 14.5c.4 1.9 1.2 2.7 3.1 3.1-1.9.4-2.7 1.2-3.1 3.1-.4-1.9-1.2-2.7-3.1-3.1 1.9-.4 2.7-1.2 3.1-3.1Z" fill="currentColor" stroke="none"/>`,
  rose: `<circle cx="12" cy="8" r="2.6"/><circle cx="12" cy="8" r="4.4"/><path d="M12 12.4V21"/><path d="M12 17c-2.2 0-3.4-1.1-3.4-1.1s1 2.3 3.4 2.3"/>`,
  pizza: `<path d="M12 3 21.5 19.5H2.5Z"/><circle cx="11" cy="12.4" r="1" fill="currentColor" stroke="none"/><circle cx="14.3" cy="15.6" r="1" fill="currentColor" stroke="none"/><circle cx="9.3" cy="16.2" r="1" fill="currentColor" stroke="none"/>`,
  mountain: `<path d="M2.5 19 8.8 8l3.7 5.6 1.8-2.6 6.2 8Z"/><circle cx="7.3" cy="6" r="1.4" fill="currentColor" stroke="none"/>`,
  plane: `<path d="M21.5 2.5 10.8 13.2"/><path d="M21.5 2.5 15 21.5l-4-8.3-8.3-4Z"/>`,

  // Acciones de interfaz
  plus: `<path d="M12 5v14"/><path d="M5 12h14"/>`,
  x: `<path d="M6 6l12 12"/><path d="M18 6 6 18"/>`,
  pencil: `<path d="M15.7 4.8 19.2 8.3 8.6 18.9 4 20l1.1-4.6Z"/>`,
  trash: `<path d="M4.5 7h15"/><path d="M9 7V5.3A1.3 1.3 0 0 1 10.3 4h3.4A1.3 1.3 0 0 1 15 5.3V7"/><path d="M6.7 7 7.5 19.4A2 2 0 0 0 9.5 21.2h5A2 2 0 0 0 16.5 19.4L17.3 7"/><path d="M10.3 11v6.3"/><path d="M13.7 11v6.3"/>`,
  'chevron-left': `<path d="M15 5 8 12l7 7"/>`,
  'chevron-right': `<path d="M9 5l7 7-7 7"/>`,
  'chevron-down': `<path d="M5 9l7 7 7-7"/>`,
  'chevron-up': `<path d="M5 15l7-7 7 7"/>`,
  check: `<path d="M4.5 12.8 9 17.3 19.5 6.8"/>`,
  circle: `<circle cx="12" cy="12" r="8.5"/>`,
  download: `<path d="M12 3.5v11.5"/><path d="M7.3 10.3 12 15l4.7-4.7"/><path d="M4.5 18.5h15"/>`,
  smartphone: `<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.3h2"/>`,
};

export type IconName = keyof typeof ICONS;
