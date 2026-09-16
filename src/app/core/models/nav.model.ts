export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/inicio', icon: 'home' },
  { label: 'Mis tareas', path: '/tareas', icon: 'check-square' },
  { label: 'Calendario', path: '/calendario', icon: 'calendar' },
  { label: 'Mis metas', path: '/metas', icon: 'target' },
  { label: 'Journal', path: '/journal', icon: 'camera' },
  { label: 'Recompensas', path: '/recompensas', icon: 'gift' },
  { label: 'Mensajes', path: '/mensajes', icon: 'mail-heart' },
  { label: 'Nosotros', path: '/nosotros', icon: 'heart' },
];

/** Solo algunos ítems para la barra inferior de móvil, para que no se vea cargada. */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  NAV_ITEMS[7],
];
