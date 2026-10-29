import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const permisoGuard: CanActivateFn = (route) => {
  const permiso = route.data['permiso'] as string | undefined;
  return !permiso || inject(AuthService).tienePermiso(permiso)
    ? true
    : inject(Router).createUrlTree(['/acceso-denegado']);
};
