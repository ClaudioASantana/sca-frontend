import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingService } from '../../core/ui/loading.service';

@Component({
  selector: 'sca-settings',
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
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private loading = inject(LoadingService);

  form = this.fb.group({
    overlayDelay: [this.loading.getMinDelay(), [Validators.required, Validators.min(0), Validators.max(5000)]]
  });
  saving = false;

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.saving = true;
    this.loading.setMinDelay(v.overlayDelay!);
    this.saving = false;
    this.snack.open('Delay do overlay atualizado', 'Fechar', { duration: 2000 });
  }
}
