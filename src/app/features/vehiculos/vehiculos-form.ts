import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ClienteApi, VehiculoApi } from '../../core/services/api.services';
import { Cliente, ErrorApi, VehiculoRequest } from '../../core/models/api.models';
import { apiMessage } from '../../core/utils/api-error';

@Component({ selector:'app-vehiculos-form',standalone:true,imports:[ReactiveFormsModule,RouterLink],templateUrl:'./vehiculos-form.html',styleUrl:'../servicios/servicios.css' })
export class VehiculosFormComponent {
  private readonly api=inject(VehiculoApi);private readonly router=inject(Router);private readonly route=inject(ActivatedRoute);
  readonly id=Number(this.route.snapshot.paramMap.get('id'))||null;readonly clientes=signal<Cliente[]>([]);readonly loading=signal(false);readonly saving=signal(false);readonly error=signal('');readonly fieldErrors=signal<Record<string,string>>({});readonly form;
  constructor(fb:FormBuilder){this.form=fb.nonNullable.group({placa:['',[Validators.required,Validators.pattern(/^[A-Z]{3}-[0-9]{3}$/)]],marca:['',[Validators.required,Validators.maxLength(40)]],modelo:['',[Validators.required,Validators.maxLength(40)]],anio:[2026,[Validators.required,Validators.min(1990),Validators.max(2027)]],clienteId:[0,[Validators.required,Validators.min(1)]]});inject(ClienteApi).listar().subscribe({next:x=>this.clientes.set(x),error:e=>this.error.set(apiMessage(e,'No se pudieron cargar los clientes.'))});if(this.id){this.loading.set(true);this.api.obtener(this.id).subscribe({next:x=>{this.form.patchValue(x);this.loading.set(false)},error:e=>{this.error.set(apiMessage(e,'No se encontró el vehículo.'));this.loading.set(false)}})}}
  mensaje(campo:string):string{const f=this.form.get(campo);if(f?.hasError('required')||f?.hasError('min')&&campo==='clienteId')return 'Selecciona un cliente.';if(f?.hasError('pattern'))return 'Usa el formato ABC-123.';if(f?.hasError('min'))return 'El año mínimo es 1990.';if(f?.hasError('max'))return 'El año máximo es 2027.';if(f?.hasError('maxlength'))return 'Máximo 40 caracteres.';return this.fieldErrors()[campo]??''}
  guardar():void{this.error.set('');this.fieldErrors.set({});if(this.form.invalid){this.form.markAllAsTouched();return}this.saving.set(true);const body=this.form.getRawValue() as VehiculoRequest;const request=this.id?this.api.actualizar(this.id,body):this.api.crear(body);request.subscribe({next:()=>void this.router.navigate(['/vehiculos']),error:e=>{this.error.set(apiMessage(e,'No se pudo guardar el vehículo.'));this.fieldErrors.set(e instanceof HttpErrorResponse?(e.error as ErrorApi)?.campos??{}:{});this.saving.set(false)}})}
}
