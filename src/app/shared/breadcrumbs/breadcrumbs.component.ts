import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

type Crumb = { label: string; url: string };

@Component({
  selector: 'sca-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent {
  crumbs: Crumb[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.build();
    this.router.events.subscribe(() => this.build());
  }

  private build() {
    const crumbs: Crumb[] = [];
    let current = this.route.root;
    let url = '';
    while (current) {
      const routeConfig = current.routeConfig;
      const label = (routeConfig && routeConfig.data && (routeConfig.data as any).breadcrumb) as string;
      if (label) {
        if (routeConfig && routeConfig.path) url += `/${routeConfig.path}`;
        crumbs.push({ label, url });
      }
      const firstChild = current.firstChild;
      if (!firstChild) break;
      current = firstChild;
    }
    this.crumbs = crumbs;
  }
}
