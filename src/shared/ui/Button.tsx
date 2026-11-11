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
    'relative inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] cursor-pointer select-none rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]',
  };

  // Modern glassmorphism without tacky 3-color saturated gradients
  const variantStyles = {
    primary:
      'bg-sky-600 hover:bg-sky-500 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950 font-semibold shadow-[0_4px_14px_rgba(2,132,199,0.3)] hover:shadow-[0_6px_22px_rgba(2,132,199,0.4)] border border-sky-400/40 dark:border-sky-300/40',
    secondary:
      'bg-white/80 hover:bg-white text-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-white/10 shadow-sm backdrop-blur-md',
    glass:
      'bg-white/50 hover:bg-white/70 text-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-100 border border-white/80 dark:border-white/15 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
    ghost:
      'hover:bg-slate-200/60 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_4px_14px_rgba(225,29,72,0.25)] border border-rose-400/30',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-[0_4px_14px_rgba(5,150,105,0.25)] border border-emerald-400/30',
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
      {/* Specular glass reflection line on top edge for primary and glass variants */}
      {(variant === 'primary' || variant === 'glass') && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30 dark:bg-white/35" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
