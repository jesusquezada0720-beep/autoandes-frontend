import { Routes } from '@angular/router';
import { authGuard, invitadoGuard } from './core/guards/auth.guards';
import { permisoGuard } from './core/guards/permiso.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [invitadoGuard], loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
  { path: 'acceso-denegado', loadComponent: () => import('./shared/pages/acceso-denegado/acceso-denegado').then(m => m.AccesoDenegadoComponent) },
  { path: '', canActivate: [authGuard], loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayoutComponent), children: [
    { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    { path: 'inicio', loadComponent: () => import('./features/inicio/inicio').then(m => m.InicioComponent) },
    { path: 'servicios', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_LEER' }, loadComponent: () => import('./features/servicios/servicios-list').then(m => m.ServiciosListComponent) },
    { path: 'servicios/nuevo', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_ESCRIBIR' }, loadComponent: () => import('./features/servicios/servicios-form').then(m => m.ServiciosFormComponent) },
    { path: 'servicios/:id/editar', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_ESCRIBIR' }, loadComponent: () => import('./features/servicios/servicios-form').then(m => m.ServiciosFormComponent) },
    { path: 'vehiculos', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_LEER' }, loadComponent: () => import('./features/vehiculos/vehiculos-list').then(m => m.VehiculosListComponent) },
    { path: 'vehiculos/nuevo', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_ESCRIBIR' }, loadComponent: () => import('./features/vehiculos/vehiculos-form').then(m => m.VehiculosFormComponent) },
    { path: 'vehiculos/:id/editar', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_ESCRIBIR' }, loadComponent: () => import('./features/vehiculos/vehiculos-form').then(m => m.VehiculosFormComponent) },
    { path: 'ordenes/nueva', canActivate: [permisoGuard], data: { permiso: 'ORDEN_REGISTRAR' }, loadComponent: () => import('./features/ordenes/orden-form').then(m => m.OrdenFormComponent) },
    { path: 'ordenes', canActivate: [permisoGuard], data: { permiso: 'ORDEN_LEER' }, loadComponent: () => import('./features/ordenes/orden-list').then(m => m.OrdenListComponent) },
    { path: 'ordenes/:id', canActivate: [permisoGuard], data: { permiso: 'ORDEN_LEER' }, loadComponent: () => import('./features/ordenes/orden-list').then(m => m.OrdenListComponent) },
    { path: 'reportes', canActivate: [permisoGuard], data: { permiso: 'REPORTE_VER' }, loadComponent: () => import('./features/reportes/reporte').then(m => m.ReporteComponent) },
  ] },
  { path: '**', loadComponent: () => import('./shared/pages/no-encontrado/no-encontrado').then(m => m.NoEncontradoComponent) },
];
