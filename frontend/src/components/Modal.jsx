import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Modal({ open, onClose, title, children, footer, size = 'md', testId }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" data-testid={testId || 'modal'}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={cn('relative w-full card', size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-3xl' : 'max-w-lg')}>
        <div className="flex items-center justify-between px-5 py-4 border-b divider">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" aria-label="Close" data-testid="modal-close">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-4 border-t divider flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'max-w-md', testId }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]" data-testid={testId || 'drawer'}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn('absolute top-0 bottom-0 card w-full', width, side === 'right' ? 'right-0 border-l' : 'left-0 border-r')}>
        <div className="flex items-center justify-between px-5 py-4 border-b divider">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted" data-testid="drawer-close">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 h-[calc(100%-64px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
