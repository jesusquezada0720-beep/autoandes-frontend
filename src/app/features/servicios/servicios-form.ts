import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ServicioApi } from '../../core/services/api.services';
import { ErrorApi, ServicioRequest } from '../../core/models/api.models';
import { apiMessage } from '../../core/utils/api-error';

@Component({ selector: 'app-servicios-form', standalone: true, imports: [ReactiveFormsModule, RouterLink], templateUrl: './servicios-form.html', styleUrl: './servicios.css' })
export class ServiciosFormComponent {
  private readonly api = inject(ServicioApi); private readonly router = inject(Router); private readonly route = inject(ActivatedRoute);
  readonly id = Number(this.route.snapshot.paramMap.get('id')) || null; readonly loading = signal(false); readonly saving = signal(false); readonly error = signal(''); readonly fieldErrors = signal<Record<string,string>>({});
  readonly form;
  constructor(fb: FormBuilder) {
    this.form = fb.nonNullable.group({ codigo: ['', [Validators.required, Validators.pattern(/^SRV-[0-9]{3}$/)]], nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]], precio: [0, [Validators.required, Validators.min(0.01)]], duracionMin: [15, [Validators.required, Validators.min(15), Validators.max(480)]] });
    if (this.id) { this.loading.set(true); this.api.obtener(this.id).subscribe({ next: x => { this.form.patchValue(x); this.loading.set(false); }, error: e => { this.error.set(apiMessage(e, 'No se encontró el servicio.')); this.loading.set(false); } }); }
  }
  mensaje(campo: string): string { const f=this.form.get(campo); if(f?.hasError('required'))return 'Este campo es obligatorio.'; if(f?.hasError('pattern'))return 'Usa el formato SRV-000.'; if(f?.hasError('minlength'))return 'Escribe al menos 3 caracteres.'; if(f?.hasError('maxlength'))return 'Máximo 80 caracteres.'; if(f?.hasError('min'))return 'Debe ser mayor que cero.'; if(f?.hasError('max'))return 'El máximo es 480 minutos.'; return this.fieldErrors()[campo]??''; }
  guardar(): void { this.error.set(''); this.fieldErrors.set({}); if(this.form.invalid){this.form.markAllAsTouched();return;} this.saving.set(true); const body=this.form.getRawValue() as ServicioRequest; const request=this.id?this.api.actualizar(this.id,body):this.api.crear(body); request.subscribe({next:()=>void this.router.navigate(['/servicios']),error:e=>{this.error.set(apiMessage(e,'No se pudo guardar el servicio.'));this.fieldErrors.set(e instanceof HttpErrorResponse?(e.error as ErrorApi)?.campos??{}:{});this.saving.set(false);}}); }
}
