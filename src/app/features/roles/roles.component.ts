import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'sca-roles',
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
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    key: ['', [Validators.required, Validators.minLength(2)]]
  });
  loading = false;

  create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.form.reset({ name: '', key: '' });
      this.snack.open('Papel criado (exemplo)', 'Fechar', { duration: 2500 });
    }, 600);
  }
}
