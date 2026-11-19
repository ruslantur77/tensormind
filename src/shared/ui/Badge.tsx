import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'violet' | 'success' | 'warning' | 'neutral' | 'draft';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    cyan: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20',
    violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
    neutral: 'bg-[var(--tm-badge-bg)] text-[var(--tm-badge-text)] border border-[var(--tm-badge-border)]',
    draft: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-mono tracking-wider uppercase',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
