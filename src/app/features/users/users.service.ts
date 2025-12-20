import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type User = {
  id: number | string;
  name: string;
  email: string;
  role?: 'admin' | 'manager' | 'user';
  status?: 'active' | 'inactive' | 'pending';
};

export type UsersPage = {
  items: User[];
  total: number;
  page: number;
  size: number;
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) { }

  getUsers(params?: { page?: number; size?: number; q?: string }): Observable<UsersPage> {
    const p = new HttpParams({
      fromObject: {
        page: String(params?.page ?? 1),
        limit: String(params?.size ?? 12),
        q: params?.q ?? ''
      }
    });
    return this.http.get<any>('/api/v1/users', { params: p }).pipe(
      map((res) => {
        const rawItems = Array.isArray(res) ? res : (res?.data ?? res?.items ?? res?.results ?? []);
        const total = (res?.meta?.total ?? res?.total ?? res?.count ?? rawItems?.length ?? 0);
        const page = Number(res?.meta?.page ?? res?.page ?? params?.page ?? 1);
        const size = Number(res?.meta?.limit ?? res?.size ?? res?.limit ?? params?.size ?? 12);

        const items: User[] = (rawItems || []).map((it: any) => ({
          id: it.id ?? it.userId ?? it.uuid ?? it._id,
          name: it.name ?? it.nome ?? 'Sem nome',
          email: it.email ?? 'sem-email@example.com',
          role: it.role ?? it.papel ?? it.roleName ?? undefined,
          status: it.status ?? it.situacao ?? undefined
        }));
        return { items, total, page, size } as UsersPage;
      }),
      catchError(() => of({ items: [], total: 0, page: Number(params?.page ?? 1), size: Number(params?.size ?? 12) }))
    );
  }

  createUser(payload: { name: string; email: string; age: number }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/v1/users', payload);
  }
}
