import { Component, ViewChild, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { UsersService, User } from './users.service';
import { take } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'sca-users',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private service = inject(UsersService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  users: User[] = [];
  total = 0;
  pageSize = 12;
  pageIndex = 0;
  query = '';
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]] ,
    age: [18, [Validators.required, Validators.min(18), Validators.max(120)]]
  });
  loading = false;
  @ViewChild('confirmDialog') dialogTpl!: TemplateRef<any>;

  ngOnInit() {
    this.refresh();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.query = filterValue.trim();
    this.pageIndex = 0;
    this.refresh();
  }

  create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const ref = this.dialog.open(this.dialogTpl, { disableClose: true });
    ref.afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const v = this.form.getRawValue();
      const payload = { name: v.name!, email: v.email!, age: v.age! };
      this.loading = true;
      this.service.createUser(payload).pipe(take(1)).subscribe({
        next: () => {
          this.form.reset({ name: '', email: '', age: 18 });
          this.refresh();
          this.loading = false;
          this.snack.open('Usuário criado com sucesso', 'Fechar', { duration: 3000 });
        },
        error: () => {
          this.loading = false;
          this.snack.open('Falha ao criar usuário', 'Fechar', { duration: 4000 });
        }
      });
    });
  }

  private refresh() {
    this.service.getUsers({ page: this.pageIndex + 1, size: this.pageSize, q: this.query }).pipe(take(1)).subscribe({
      next: (page) => {
        this.users = page.items;
        this.total = page.total;
      },
      error: () => {
        this.users = [];
        this.total = 0;
      }
    });
  }

  newUser() {
    this.snack.open('Novo usuário: em breve', 'Fechar', { duration: 2500 });
  }

  view(u: User) {
    this.snack.open(`Visualizar: ${u.name}`, 'Fechar', { duration: 2000 });
  }

  edit(u: User) {
    this.snack.open(`Editar: ${u.name}`, 'Fechar', { duration: 2000 });
  }

  remove(u: User) {
    const ref = this.dialog.open(this.dialogTpl, { disableClose: true });
    ref.afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.snack.open(`Excluído: ${u.name}`, 'Fechar', { duration: 2000 });
    });
  }

  shownCount() {
    return this.users.length;
  }

  totalCount() {
    return this.total;
  }

  onPage(event: any) {
    this.pageIndex = event.pageIndex ?? 0;
    this.pageSize = event.pageSize ?? this.pageSize;
    this.refresh();
  }
  roleClass(role?: string) {
    const r = (role || '').toLowerCase();
    if (r === 'admin') return 'tag-admin';
    if (r === 'manager' || r === 'gestor') return 'tag-manager';
    return 'tag-user';
  }

  statusClass(status?: string) {
    const s = (status || '').toLowerCase();
    if (s === 'active' || s === 'ativo') return 'tag-active';
    if (s === 'pending' || s === 'pendente') return 'tag-pending';
    return 'tag-inactive';
  }
}
