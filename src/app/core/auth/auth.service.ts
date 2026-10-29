import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, Permiso, UsuarioSesion } from '../models/api.models';

interface SesionGuardada { token: string; expiraEn: number; usuario: UsuarioSesion; }
const SESSION_KEY = 'autoandes.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sesion = signal<SesionGuardada | null>(this.restaurar());
  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  readonly autenticado = computed(() => {
    const actual = this.sesion();
    return !!actual && actual.expiraEn > Date.now();
  });
  private expiracionTimer?: ReturnType<typeof setTimeout>;

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    this.programarExpiracion();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap((respuesta) => {
        const usuario: UsuarioSesion = {
          username: this.usernameDelToken(respuesta.token) ?? username,
          nombreCompleto: respuesta.nombreCompleto,
          roles: respuesta.roles,
          permisos: respuesta.permisos,
        };
        this.guardar({ token: respuesta.token, expiraEn: Date.now() + respuesta.expiraEnSegundos * 1000, usuario });
      }),
    );
  }

  token(): string | null {
    const actual = this.sesion();
    if (!actual || actual.expiraEn <= Date.now()) { this.cerrarSesion(); return null; }
    return actual.token;
  }

  tienePermiso(permiso: Permiso | string): boolean {
    return this.autenticado() && !!this.usuario()?.permisos.includes(permiso as Permiso);
  }

  cerrarSesion(): void {
    this.sesion.set(null);
    sessionStorage.removeItem(SESSION_KEY);
    if (this.expiracionTimer) clearTimeout(this.expiracionTimer);
  }

  private guardar(value: SesionGuardada): void {
    this.sesion.set(value);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    this.programarExpiracion();
  }

  private restaurar(): SesionGuardada | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const value = JSON.parse(raw) as SesionGuardada;
      return value.expiraEn > Date.now() ? value : null;
    } catch { return null; }
  }

  private programarExpiracion(): void {
    if (this.expiracionTimer) clearTimeout(this.expiracionTimer);
    const actual = this.sesion();
    if (!actual) return;
    this.expiracionTimer = setTimeout(() => {
      this.cerrarSesion();
      void this.router.navigate(['/login'], { queryParams: { expirado: '1' } });
    }, Math.max(0, actual.expiraEn - Date.now()));
  }

  private usernameDelToken(token: string): string | null {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload)).sub ?? null;
    } catch { return null; }
  }
}
