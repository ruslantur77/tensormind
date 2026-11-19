import React from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Kept for API compatibility; panels no longer use glow effects. */
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  glow: _glow,
  ...props
}) => {
  return (
    <div className={`aero-glass rounded-xl ${className}`} {...props}>
      {children}
    </div>
  );
};
