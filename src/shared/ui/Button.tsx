import React from 'react';
import { platform } from '@/shared/lib/platform';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    platform.haptics.light();
    onClick?.(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-colors duration-150 active:scale-[0.99] cursor-pointer select-none rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]',
  };

  const variantStyles = {
    primary:
      'bg-sky-600 hover:bg-sky-500 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 font-semibold border border-transparent',
    secondary:
      'bg-[var(--tm-surface)] hover:bg-[var(--tm-surface-hover)] text-slate-800 dark:text-slate-100 border border-[var(--tm-card-border)]',
    glass:
      'bg-transparent hover:bg-[var(--tm-surface-hover)] text-slate-700 dark:text-slate-200 border border-[var(--tm-card-border)]',
    ghost:
      'hover:bg-[var(--tm-surface-hover)] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white font-semibold border border-transparent',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
