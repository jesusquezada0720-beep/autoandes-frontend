import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MENU_ITEMS } from '../../core/config/menu';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="welcome">
      <h1>Inicio</h1>
      <p>Bienvenido, {{nombre}}.</p>
    </section>
    <section class="quick-grid">
      @for (item of items; track item.path) {
        <a class="quick-card" [routerLink]="item.path">{{item.label}}</a>
      }
    </section>
  `,
  styles: [`
    :host{display:block}.welcome{background:#fff;border:1px solid #ddd;padding:20px;margin-bottom:16px}
    h1{font-size:24px;margin:0 0 6px;color:#222}.welcome p{margin:0;color:#555;font-size:14px}
    .quick-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}
    .quick-card{display:block;background:#fff;border:1px solid #ccc;padding:16px;color:#245a72;text-decoration:underline;font-size:14px}
    .quick-card:hover{background:#f2f2f2}
  `],
})
export class InicioComponent {
  private readonly auth = inject(AuthService);
  readonly nombre = this.auth.usuario()?.nombreCompleto?.split(' ')[0] ?? 'usuario';
  readonly items = MENU_ITEMS.filter(item => !item.permiso || this.auth.tienePermiso(item.permiso));
}
