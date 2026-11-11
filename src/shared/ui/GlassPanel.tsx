import React from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`aero-glass rounded-2xl relative overflow-hidden ${
        glow ? 'shadow-[0_0_30px_rgba(56,189,248,0.15)]' : ''
      } ${className}`}
      {...props}
    >
      {/* Solid Glass Highlight Reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20 dark:bg-white/10" />
      {children}
    </div>
  );
};
