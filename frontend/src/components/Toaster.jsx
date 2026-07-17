import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Toaster() {
  const { toasts } = useApp();
  return (
    <div className="fixed z-[200] bottom-4 right-4 flex flex-col gap-2 w-[320px]" data-testid="toaster">
      {toasts.map(t => {
        const Icon = t.kind === 'success' ? CheckCircle2 : t.kind === 'error' ? AlertCircle : Info;
        const tone = t.kind === 'success' ? 'text-success' : t.kind === 'error' ? 'text-danger' : 'text-ai';
        return (
          <div key={t.id} className="card px-4 py-3 flex items-start gap-3 shadow-lg animate-tick">
            <Icon size={18} className={cn('mt-0.5 shrink-0', tone)} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{t.title}</div>
              {t.body && <div className="text-xs text-sub mt-0.5">{t.body}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
