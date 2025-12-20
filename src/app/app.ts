import { Component, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { LoadingService } from './core/ui/loading.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'sca-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sca-frontend');
  protected readonly sidenavOpen = signal(true);
  protected readonly collapsed = signal(false);
  protected readonly loginView = signal(false);
  protected readonly administracaoOpen = signal(false);

  protected readonly menu = [
    { label: 'Dashboard', icon: 'dashboard', path: 'dashboard' },
    {
      label: 'Administração',
      children: [
        { label: 'Usuários', icon: 'group', path: 'users' },
        { label: 'Papéis', icon: 'security', path: 'roles' },
        { label: 'Permissões', icon: 'vpn_key', path: 'permissions' }
      ]
    },
    { label: 'Configurações', icon: 'settings', path: 'settings' }
  ];

  constructor(private router: Router, protected auth: AuthService, protected loading: LoadingService) { }

  ngOnInit() {
    try {
      const saved = localStorage.getItem('menu-collapsed');
      if (saved === 'true') this.collapsed.set(true);
    } catch { }

    this.loginView.set(this.router.url.startsWith('/login'));
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.loginView.set(e.urlAfterRedirects.startsWith('/login'));
      }
    });
  }

  toggleCollapsed() {
    const next = !this.collapsed();
    this.collapsed.set(next);
    try {
      localStorage.setItem('menu-collapsed', String(next));
    } catch { }
  }

  toggleAdministracao() {
    this.administracaoOpen.set(!this.administracaoOpen());
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  initials() {
    const name = this.auth.user?.name ?? '';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? 'U';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }
}
