import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClienteApi, OrdenApi, ServicioApi, VehiculoApi } from '../../core/services/api.services';
import { Cliente, Orden, Servicio, Vehiculo } from '../../core/models/api.models';
import { apiMessage } from '../../core/utils/api-error';

@Component({selector:'app-orden-form',standalone:true,imports:[CommonModule,ReactiveFormsModule,RouterLink],templateUrl:'./orden-form.html'})
export class OrdenFormComponent {
  private readonly fb=inject(FormBuilder);private readonly api=inject(OrdenApi);
  readonly vehiculos=signal<Vehiculo[]>([]);readonly clientes=signal<Cliente[]>([]);readonly servicios=signal<Servicio[]>([]);readonly loading=signal(true);readonly saving=signal(false);readonly error=signal('');readonly creado=signal<Orden|null>(null);
  readonly form=this.fb.group({vehiculoId:[null as number|null,Validators.required],kilometraje:[null as number|null,[Validators.required,Validators.min(0)]],detalles:this.fb.array([this.linea()],[Validators.required,Validators.minLength(1),Validators.maxLength(10)])});
  readonly total=computed(()=>this.lineas.controls.reduce((sum,row,i)=>sum+this.subtotal(i),0));
  get lineas():FormArray{return this.form.controls.detalles as FormArray;}
  constructor(){let pending=3;const done=()=>{if(--pending===0)this.loading.set(false)};inject(VehiculoApi).listar().subscribe({next:x=>{this.vehiculos.set(x);done()},error:e=>{this.error.set(apiMessage(e,'No se pudieron cargar vehículos.'));done()}});inject(ClienteApi).listar().subscribe({next:x=>{this.clientes.set(x);done()},error:e=>{this.error.set(apiMessage(e,'No se pudieron cargar clientes.'));done()}});inject(ServicioApi).listar().subscribe({next:x=>{this.servicios.set(x.filter(s=>s.activo));done()},error:e=>{this.error.set(apiMessage(e,'No se pudieron cargar servicios.'));done()}})}
  private linea(){return this.fb.group({servicioId:[null as number|null,Validators.required],cantidad:[1,[Validators.required,Validators.min(1),Validators.max(5)]]})}
  servicioId(i:number):number|null{return this.lineas.at(i).get('servicioId')?.value??null}
  servicio(i:number):Servicio|undefined{return this.servicios().find(s=>s.id===this.servicioId(i) )}
  disponibles(i:number):Servicio[]{const usados=this.lineas.controls.map((_,j)=>j===i?null:this.servicioId(j));return this.servicios().filter(s=>!usados.includes(s.id))}
  subtotal(i:number):number{const row=this.lineas.at(i);const svc=this.servicios().find(s=>s.id===row.get('servicioId')?.value);return (svc?.precio??0)*Number(row.get('cantidad')?.value??0)}
  agregar():void{if(this.lineas.length<10)this.lineas.push(this.linea())}
  quitar(i:number):void{if(this.lineas.length>1)this.lineas.removeAt(i)}
  registrar():void{this.error.set('');this.creado.set(null);if(this.form.invalid){this.form.markAllAsTouched();return}this.saving.set(true);const value=this.form.getRawValue();this.api.crear({vehiculoId:value.vehiculoId!,kilometraje:value.kilometraje!,detalles:value.detalles.map(d=>({servicioId:d.servicioId!,cantidad:Number(d.cantidad)}))}).subscribe({next:o=>{this.creado.set(o);this.saving.set(false)},error:e=>{this.error.set(apiMessage(e,'No se pudo registrar la orden. Revisa los datos y vuelve a intentar.'));this.saving.set(false)}})}
  nombreCliente(vehiculo:Vehiculo):string{return this.clientes().find(c=>c.id===vehiculo.clienteId)?.nombres??vehiculo.clienteNombre}
}
