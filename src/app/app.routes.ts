import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin.guard';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canMatch: [authGuard],
    data: { breadcrumb: 'Home' }
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canMatch: [guestGuard],
    data: { breadcrumb: 'Login' }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canMatch: [authGuard],
    data: { breadcrumb: 'Dashboard' }
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
    canMatch: [authGuard],
    data: { breadcrumb: 'Usuários' }
  },
  {
    path: 'roles',
    loadComponent: () => import('./features/roles/roles.component').then(m => m.RolesComponent),
    canMatch: [authGuard, adminGuard],
    data: { breadcrumb: 'Papéis' }
  },
  {
    path: 'permissions',
    loadComponent: () => import('./features/permissions/permissions.component').then(m => m.PermissionsComponent),
    canMatch: [authGuard, adminGuard],
    data: { breadcrumb: 'Permissões' }
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canMatch: [authGuard],
    data: { breadcrumb: 'Configurações' }
  }
];
