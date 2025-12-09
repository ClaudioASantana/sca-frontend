import { Injectable, InjectionToken, inject, signal } from '@angular/core';

export const LOADING_MIN_DELAY = new InjectionToken<number>('LOADING_MIN_DELAY');

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private active = 0;
  private visible = signal(false);
  private msg = signal('');
  private kindSig = signal<'auth' | 'default'>('default');
  private lastStart = 0;
  private minDelay = inject(LOADING_MIN_DELAY, { optional: true }) ?? 250;

  constructor() {
    try {
      const raw = localStorage.getItem('ui.loading.minDelay');
      const v = raw ? parseInt(raw, 10) : NaN;
      if (!isNaN(v) && v >= 0 && v <= 5000) this.minDelay = v;
    } catch {}
  }

  start(label?: string, kind: 'auth' | 'default' = 'default') {
    if (this.active === 0) this.lastStart = Date.now();
    this.active += 1;
    this.visible.set(true);
    this.msg.set(label || 'Carregando...');
    this.kindSig.set(kind);
  }

  stop() {
    const now = Date.now();
    this.active = this.active > 0 ? this.active - 1 : 0;
    if (this.active === 0) {
      const elapsed = now - this.lastStart;
      const remain = this.minDelay - elapsed;
      if (remain > 0) {
        setTimeout(() => {
          if (this.active === 0) {
            this.visible.set(false);
            this.msg.set('');
          }
        }, remain);
      } else {
        this.visible.set(false);
        this.msg.set('');
      }
    }
  }

  isLoading() {
    return this.visible();
  }

  message() {
    return this.msg();
  }

  kind() {
    return this.kindSig();
  }

  setMinDelay(ms: number) {
    const v = Number(ms);
    if (!Number.isFinite(v) || v < 0) return;
    this.minDelay = v;
    try { localStorage.setItem('ui.loading.minDelay', String(v)); } catch {}
  }

  getMinDelay() {
    return this.minDelay;
  }
}
