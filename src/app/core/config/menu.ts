import { Permiso } from '../models/api.models';
export interface MenuItem { label: string; path: string; permiso?: Permiso; }
export const MENU_ITEMS: MenuItem[] = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Servicios', path: '/servicios', permiso: 'SERVICIO_LEER' },
  { label: 'Vehículos', path: '/vehiculos', permiso: 'VEHICULO_LEER' },
  { label: 'Órdenes', path: '/ordenes', permiso: 'ORDEN_LEER' },
  { label: 'Nueva orden', path: '/ordenes/nueva', permiso: 'ORDEN_REGISTRAR' },
  { label: 'Reportes', path: '/reportes', permiso: 'REPORTE_VER' },
];
