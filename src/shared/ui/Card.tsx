import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = false,
  ...props
}) => {
  return (
    <div
      className={`aero-card rounded-2xl p-4 sm:p-5 relative overflow-hidden ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {/* Specular glass reflection line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/70 dark:bg-white/10" />
      {children}
    </div>
  );
};
