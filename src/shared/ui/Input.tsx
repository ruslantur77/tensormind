import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">{icon}</div>}
        <input
          className={`w-full bg-white/80 dark:bg-slate-900/80 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition focus:outline-none focus:ring-2 focus:ring-sky-400/40 ${
            icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-red-500/60 focus:border-red-500'
              : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 focus:border-sky-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
};
