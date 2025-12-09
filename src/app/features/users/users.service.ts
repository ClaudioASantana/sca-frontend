import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type User = {
  id: number | string;
  name: string;
  email: string;
  role?: 'admin' | 'manager' | 'user';
  status?: 'active' | 'inactive' | 'pending';
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<any[]>('/api/v1/users').pipe(
      map((items) => items.map((it) => ({
        id: it.id ?? it.userId ?? it.uuid ?? it._id,
        name: it.name ?? it.nome ?? 'Sem nome',
        email: it.email ?? 'sem-email@example.com'
      }) as User)),
      catchError(() => of([]))
    );
  }

  createUser(payload: { name: string; email: string; age: number }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/v1/users', payload);
  }
}
