import { platform } from '@/shared/lib/platform';

export type AppTheme = 'dark' | 'light' | 'system';

export function getEffectiveTheme(theme: AppTheme): 'dark' | 'light' {
  if (theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }
  return theme;
}

export function applyTheme(theme: AppTheme) {
  if (typeof document === 'undefined') return;

  const effective = getEffectiveTheme(theme);
  const root = document.documentElement;

  // Set data-theme attribute
  root.setAttribute('data-theme', effective);

  // Sync Tailwind class
  if (effective === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }

  // Sync mobile status bar
  platform.statusBar.setStyle(effective === 'dark');
}
