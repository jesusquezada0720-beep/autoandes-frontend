import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { apiMessage } from '../../../core/utils/api-error';

@Component({ selector: 'app-login', standalone: true, imports: [ReactiveFormsModule], templateUrl: './login.html', styleUrl: './login.css' })
export class LoginComponent {
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly expirado: boolean;
  readonly form;

  constructor(fb: FormBuilder, private auth: AuthService, private router: Router, route: ActivatedRoute) {
    this.expirado = route.snapshot.queryParamMap.has('expirado');
    this.form = fb.nonNullable.group({ username: ['', Validators.required], password: ['', Validators.required] });
  }

  entrar(): void {
    this.error.set('');
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.enviando.set(true);
    this.auth.login(this.form.controls.username.value.trim(), this.form.controls.password.value).subscribe({
      next: () => {
        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] as string | undefined;
        void this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/inicio');
      },
      error: (err) => { this.error.set(apiMessage(err, 'Usuario o contraseña incorrectos')); this.enviando.set(false); },
    });
  }
}
