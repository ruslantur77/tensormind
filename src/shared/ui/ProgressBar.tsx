import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  height?: 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'gradient' | 'success' | 'warning' | 'ochre' | 'sage';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 'md',
  variant = 'cyan',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const fillVariants = {
    cyan: 'bg-sky-500 dark:bg-sky-400',
    gradient: 'bg-sky-500 dark:bg-sky-400',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    ochre: 'bg-[var(--tm-ochre)]',
    sage: 'bg-[var(--tm-sage-fill)]',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-slate-200/80 dark:bg-white/10 rounded-full overflow-hidden ${heightClasses[height]}`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ease-out ${fillVariants[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
