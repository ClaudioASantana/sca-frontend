import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'sca-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  loading = false;
  errorMsg: string | null = null;

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.clearServerErrors();
    this.loading = true;
    this.auth.login({ email: v.email!, password: v.password! }).pipe(take(1)).subscribe({
      next: () => {
        this.loading = false;
        this.errorMsg = null;
        this.snack.open('Login realizado', 'Fechar', { duration: 2000 });
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        const msg = this.extractErrorMessage(err);
        this.applyServerFieldErrors(err);
        this.errorMsg = msg;
        console.error('Login error', err);
        this.snack.open(msg || 'Falha no login', 'Fechar', { duration: 3000 });
      }
    });
  }

  private extractErrorMessage(err: any): string {
    if (!err) return '';
    const e = err.error ?? err;
    const status = err.status ?? e?.status;
    const base = e?.message || e?.error || e?.detail || (Array.isArray(e?.errors) ? e.errors[0] : '') || err.message || '';
    if (status === 0) return 'Falha de conexão com o servidor';
    if (status === 400) return base || 'Dados inválidos';
    if (status === 401) return base || 'Credenciais inválidas';
    if (status === 403) return base || 'Acesso negado';
    if (status >= 500) return base || 'Erro interno do servidor';
    return base || 'Falha no login';
  }

  private applyServerFieldErrors(err: any) {
    const e = err?.error ?? err;
    const errs = e?.errors;
    if (!errs) return;
    if (typeof errs === 'object' && !Array.isArray(errs)) {
      Object.keys(errs).forEach((key) => {
        const ctrl = this.form.get(key);
        if (ctrl) {
          const existing = (ctrl.errors as any) || {};
          ctrl.setErrors({ ...existing, server: typeof errs[key] === 'string' ? errs[key] : JSON.stringify(errs[key]) });
        }
      });
    } else if (Array.isArray(errs)) {
      errs.forEach((it: any) => {
        const field = it?.field || it?.key || it?.path;
        const message = it?.message || it?.error || String(it);
        const ctrl = field ? this.form.get(field) : null;
        if (ctrl) {
          const existing = (ctrl.errors as any) || {};
          ctrl.setErrors({ ...existing, server: message });
        }
      });
    }
  }

  private clearServerErrors() {
    const controls = this.form.controls;
    ['email', 'password'].forEach((k) => {
      const ctrl = (controls as any)[k];
      const errs = (ctrl?.errors as any) || null;
      if (errs && errs['server']) {
        const { server, ...rest } = errs;
        ctrl.setErrors(Object.keys(rest).length ? rest : null);
      }
    });
  }
}
