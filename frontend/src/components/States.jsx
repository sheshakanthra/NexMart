import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../lib/utils';

export function EmptyState({ icon: Icon = Inbox, title, body, action, className }) {
  return (
    <div className={cn('card p-10 flex flex-col items-center text-center gap-3', className)}>
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
        <Icon size={22} className="text-sub" />
      </div>
      <h4 className="font-display text-lg font-semibold">{title}</h4>
      {body && <p className="text-sm text-sub max-w-md">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />;
}

export function ErrorState({ title = 'Something went wrong', body, onRetry }) {
  return (
    <div className="card p-8 flex flex-col items-center text-center gap-3">
      <div className="w-14 h-14 rounded-full bg-danger/15 flex items-center justify-center text-danger">!</div>
      <h4 className="font-display text-lg font-semibold">{title}</h4>
      {body && <p className="text-sm text-sub">{body}</p>}
      {onRetry && <button onClick={onRetry} className="btn btn-ghost mt-2">Retry</button>}
    </div>
  );
}
