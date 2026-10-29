import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cliente, Vehiculo } from '../../core/models/api.models';
import { ClienteApi, VehiculoApi } from '../../core/services/api.services';
import { apiMessage } from '../../core/utils/api-error';
import { SiPermisoDirective } from '../../shared/directives/si-permiso.directive';

@Component({ selector: 'app-vehiculos-list', standalone: true, imports: [RouterLink, SiPermisoDirective], templateUrl: './vehiculos-list.html', styleUrl: '../servicios/servicios.css' })
export class VehiculosListComponent {
  private readonly api=inject(VehiculoApi); private readonly clienteApi=inject(ClienteApi);
  readonly rows=signal<Vehiculo[]>([]); readonly clientes=signal<Cliente[]>([]); readonly loading=signal(true); readonly error=signal(''); readonly clienteId=signal(''); readonly busyId=signal<number|null>(null);
  constructor(){this.clienteApi.listar().subscribe({next:x=>this.clientes.set(x),error:e=>this.error.set(apiMessage(e,'No se pudieron cargar los clientes.'))});this.cargar();}
  cargar():void{this.loading.set(true);this.api.listar(this.clienteId()?Number(this.clienteId()):undefined).subscribe({next:x=>{this.rows.set(x);this.loading.set(false)},error:e=>{this.error.set(apiMessage(e,'No se pudieron cargar los vehículos.'));this.loading.set(false)}})}
  eliminar(x:Vehiculo):void{if(!confirm(`¿Eliminar el vehículo ${x.placa}?`))return;this.busyId.set(x.id);this.api.eliminar(x.id).subscribe({next:()=>{this.busyId.set(null);this.cargar()},error:e=>{this.error.set(apiMessage(e,'No se pudo eliminar el vehículo.'));this.busyId.set(null)}})}
}
