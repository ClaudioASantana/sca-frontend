import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';


export type AuthUser = {
  id: number;
  name: string;
  roles: string[];
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private current = signal<AuthUser | null>(null);

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      try { this.current.set(JSON.parse(raw)); } catch {}
    }
  }

  get user() {
    return this.current();
  }

  isAuthenticated() {
    return !!this.current();
  }

  hasRole(role: string) {
    const u = this.current();
    return !!u && u.roles.includes(role);
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<any>("/api/v1/auth/login", payload).pipe(
      switchMap((res) => {
        const token = res?.token || res?.accessToken || res?.access_token;
        const user = (res?.user || res?.data?.user) as AuthUser | undefined;
        const safeUser: AuthUser | null = user ? { id: user.id, name: user.name, roles: Array.isArray(user.roles) ? user.roles : [] } : null;
        if (token) localStorage.setItem('auth_token', token);

        if (safeUser) {
          localStorage.setItem('auth_user', JSON.stringify(safeUser));
          this.current.set(safeUser);
          return of(res);
        }

        return this.http.get<any>("/api/v1/auth/me").pipe(
          map((me) => {
            const u: AuthUser = { id: me?.id, name: me?.name, roles: Array.isArray(me?.roles) ? me.roles : [] };
            localStorage.setItem('auth_user', JSON.stringify(u));
            this.current.set(u);
            return res;
          }),
          catchError(() => {
            const fallback: AuthUser = { id: 0, name: (payload.email || 'Usuário'), roles: [] };
            localStorage.setItem('auth_user', JSON.stringify(fallback));
            this.current.set(fallback);
            return of(res);
          })
        );
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.current.set(null);
  }
}
