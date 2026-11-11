import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { platform } from '@/shared/lib/platform';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => {
          platform.haptics.light();
          onClose();
        }}
      />
      <GlassPanel glow className="relative z-10 w-full max-w-lg p-6 max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
          <button
            onClick={() => {
              platform.haptics.light();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="py-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="pt-3 border-t border-white/10 flex justify-end gap-3">{footer}</div>}
      </GlassPanel>
    </div>
  );
};
