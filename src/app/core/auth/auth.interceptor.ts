import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../ui/loading.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const isLogin = req.url.includes('/auth/login');
  if (token && !isLogin) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  const loading = inject(LoadingService);
  loading.start(isLogin ? 'Autenticando...' : 'Carregando...', isLogin ? 'auth' : 'default');
  return next(req).pipe(finalize(() => loading.stop()));
};
