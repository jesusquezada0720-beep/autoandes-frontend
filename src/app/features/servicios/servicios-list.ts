import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServicioApi } from '../../core/services/api.services';
import { Servicio } from '../../core/models/api.models';
import { apiMessage } from '../../core/utils/api-error';
import { SiPermisoDirective } from '../../shared/directives/si-permiso.directive';

@Component({ selector: 'app-servicios-list', standalone: true, imports: [CommonModule, RouterLink, SiPermisoDirective], templateUrl: './servicios-list.html', styleUrl: './servicios.css' })
export class ServiciosListComponent {
  private readonly api = inject(ServicioApi);
  readonly rows = signal<Servicio[]>([]); readonly loading = signal(true); readonly error = signal(''); readonly search = signal(''); readonly busyId = signal<number | null>(null);
  readonly filtrados = computed(() => { const q = this.search().trim().toLowerCase(); return this.rows().filter(x => !q || `${x.codigo} ${x.nombre}`.toLowerCase().includes(q)); });
  constructor() { this.cargar(); }
  cargar(): void { this.loading.set(true); this.error.set(''); this.api.listar().subscribe({ next: x => { this.rows.set(x); this.loading.set(false); }, error: e => { this.error.set(apiMessage(e, 'No se pudieron cargar los servicios.')); this.loading.set(false); } }); }
  cambiarEstado(item: Servicio): void {
    const accion = item.activo ? 'dar de baja' : 'activar';
    if (!confirm(`¿Confirmas ${accion} el servicio ${item.codigo}?`)) return;
    this.busyId.set(item.id);
    this.api.estado(item.id, !item.activo).subscribe({ next: () => { this.busyId.set(null); this.cargar(); }, error: e => { this.error.set(apiMessage(e, 'No se pudo cambiar el estado.')); this.busyId.set(null); } });
  }
  eliminar(item: Servicio): void {
    if (!confirm(`¿Eliminar el servicio ${item.codigo}? Si está asociado a una orden, el backend lo rechazará.`)) return;
    this.busyId.set(item.id);
    this.api.eliminar(item.id).subscribe({ next: () => { this.busyId.set(null); this.cargar(); }, error: e => { this.error.set(apiMessage(e, 'No se pudo eliminar el servicio.')); this.busyId.set(null); } });
  }
}
