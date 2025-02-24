import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type ThemeType = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeType>('system');
  theme$ = this.themeSubject.asObservable();
  private mediaQueryList: MediaQueryList;

  constructor() {
    this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    this.loadTheme();
    this.listenForSystemThemeChanges();
  }

  /** Loads theme from localStorage or defaults to 'system' */
  private loadTheme() {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    const theme: ThemeType = savedTheme && ['light', 'dark', 'system'].includes(savedTheme) ? savedTheme : 'system';
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  /** Sets and applies a new theme */
  setTheme(theme: ThemeType) {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  /** Applies theme dynamically */
  private applyTheme(theme: ThemeType) {
    if (theme === 'system') {
      this.updateSystemTheme();
    } else {
      document.body.classList.toggle('dark-theme', theme === 'dark');
    }
  }

  /** Listens for system theme changes dynamically */
  private listenForSystemThemeChanges() {
    this.mediaQueryList.addEventListener('change', () => {
      if (this.themeSubject.value === 'system') {
        this.updateSystemTheme();
      }
    });
  }

  /** Updates the theme based on system preference */
  private updateSystemTheme() {
    const prefersDark = this.mediaQueryList.matches;
    document.body.classList.toggle('dark-theme', prefersDark);
  }
}
