import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdenApi } from '../../core/services/api.services';
import { Orden } from '../../core/models/api.models';
import { apiMessage } from '../../core/utils/api-error';
import { SiPermisoDirective } from '../../shared/directives/si-permiso.directive';

@Component({selector:'app-orden-list',standalone:true,imports:[CommonModule,FormsModule,RouterLink,SiPermisoDirective],templateUrl:'./orden-list.html'})
export class OrdenListComponent {
  private readonly api=inject(OrdenApi);private readonly route=inject(ActivatedRoute);readonly rows=signal<Orden[]>([]);readonly detalle=signal<Orden|null>(null);readonly loading=signal(true);readonly error=signal('');readonly filtros={placa:'',estado:'',desde:'',hasta:''};readonly motivo=signal('');readonly anulando=signal(false);
  constructor(){const id=Number(this.route.snapshot.paramMap.get('id'));if(id)this.cargarDetalle(id);else this.buscar()}
  buscar():void{this.loading.set(true);this.error.set('');this.api.listar(this.filtros).subscribe({next:x=>{this.rows.set(x);this.loading.set(false)},error:e=>{this.error.set(apiMessage(e,'No se pudieron cargar las órdenes.'));this.loading.set(false)}})}
  cargarDetalle(id:number):void{this.api.obtener(id).subscribe({next:x=>{this.detalle.set(x);this.loading.set(false)},error:e=>{this.error.set(apiMessage(e,'No se encontró la orden.'));this.loading.set(false)}})}
  anular(o:Orden):void{if(!this.motivo().trim()){this.error.set('Escribe un motivo de al menos 10 caracteres.');return}this.error.set('');this.anulando.set(true);this.api.anular(o.id,this.motivo().trim()).subscribe({next:x=>{this.detalle.set(x);this.anulando.set(false)},error:e=>{this.error.set(apiMessage(e,'No se pudo anular la orden.'));this.anulando.set(false)}})}
}
