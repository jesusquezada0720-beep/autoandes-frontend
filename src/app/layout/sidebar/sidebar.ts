import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MENU_ITEMS } from '../../core/config/menu';

@Component({ selector: 'app-sidebar', standalone: true, imports: [RouterLink, RouterLinkActive], templateUrl: './sidebar.html', styleUrl: './sidebar.css' })
export class SidebarComponent {
  private readonly auth = inject(AuthService);
  readonly usuario = this.auth.usuario;
  readonly items = computed(() => MENU_ITEMS.filter(item => !item.permiso || this.auth.tienePermiso(item.permiso)));
}
