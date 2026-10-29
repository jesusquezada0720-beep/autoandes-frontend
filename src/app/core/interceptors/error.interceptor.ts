import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => next(request).pipe(catchError((error: HttpErrorResponse) => {
  const isApi = request.url.startsWith(environment.apiUrl);
  const isLogin = request.url.endsWith('/auth/login');
  if (isApi && error.status === 401 && !isLogin) {
    const router = inject(Router);
    inject(AuthService).cerrarSesion();
    void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
  }
  return throwError(() => error);
}));
