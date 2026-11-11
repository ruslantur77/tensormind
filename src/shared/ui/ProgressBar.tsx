import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  height?: 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'gradient' | 'success' | 'warning';
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
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const fillVariants = {
    cyan: 'bg-sky-500 dark:bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.35)]',
    gradient: 'bg-sky-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.35)]',
    success: 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.35)]',
    warning: 'bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.35)]',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-300/50 dark:border-white/5 ${heightClasses[height]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${fillVariants[variant]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
