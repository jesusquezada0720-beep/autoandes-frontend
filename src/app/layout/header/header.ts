import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({ selector: 'app-header', standalone: true, templateUrl: './header.html', styleUrl: './header.css' })
export class HeaderComponent {
  readonly usuario = inject(AuthService).usuario;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  cerrarSesion(): void { this.auth.cerrarSesion(); void this.router.navigate(['/login']); }
}
