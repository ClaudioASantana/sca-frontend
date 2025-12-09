import { Component, ViewChild, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { UsersService, User } from './users.service';
import { take } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'sca-users',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private service = inject(UsersService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status'];
  dataSource = new MatTableDataSource<User>([]);
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]] ,
    age: [18, [Validators.required, Validators.min(18), Validators.max(120)]]
  });
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('confirmDialog') dialogTpl!: TemplateRef<any>;

  ngOnInit() {
    this.refresh();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this.service.getUsers().pipe(take(1)).subscribe({
      next: (users) => (this.dataSource.data = users),
      error: () => (this.dataSource.data = [])
    });
  }
}
