import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Layers, BarChart3, Settings, BookOpen } from 'lucide-react';
import { platform } from '@/shared/lib/platform';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      to: '/',
      label: t('nav.home'),
      icon: Home,
      isActive: currentPath === '/',
    },
    {
      to: '/practice',
      label: t('nav.practice'),
      icon: Layers,
      isActive:
        currentPath.startsWith('/practice') ||
        currentPath.startsWith('/cards') ||
        currentPath.startsWith('/speedrun') ||
        currentPath.startsWith('/exam'),
    },
    {
      to: '/glossary',
      label: t('nav.glossary'),
      icon: BookOpen,
      isActive: currentPath.startsWith('/glossary'),
    },
    {
      to: '/stats',
      label: t('nav.stats'),
      icon: BarChart3,
      isActive: currentPath.startsWith('/stats'),
    },
    {
      to: '/settings',
      label: t('nav.settings'),
      icon: Settings,
      isActive: currentPath.startsWith('/settings'),
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 aero-bar border-t border-[var(--tm-card-border)] safe-bottom">
      <div className="max-w-md sm:max-w-lg mx-auto px-4 flex items-center justify-around h-16">
        {navItems.map(({ to, label, icon: Icon, isActive }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => platform.haptics.light()}
            className={`group flex flex-col items-center justify-center flex-1 py-1 text-xs select-none transition-colors duration-150 ${
              isActive
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg transition-colors duration-150 shrink-0 ${
                isActive
                  ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                  : 'text-slate-600 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:bg-[var(--tm-surface-hover)]'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.25]' : 'stroke-2'}`} />
            </div>
            <span className="mt-0.5 tracking-tight transition-colors duration-200">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
