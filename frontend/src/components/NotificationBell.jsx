import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { relTime } from '../lib/utils';

export function NotificationBell() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const unread = state.notifications.filter(n => !n.read).length;
  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(v => !v); if (!open) dispatch({ type: 'NOTIF_READ_ALL' }); }}
        className="relative p-2 rounded hover:bg-muted"
        aria-label="Notifications"
        data-testid="notif-bell"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-brand-fg text-[10px] font-medium flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 card z-50 max-h-[70vh] overflow-y-auto" data-testid="notif-panel">
          <div className="px-4 py-3 border-b divider flex items-center justify-between">
            <span className="label-mono">Notifications</span>
            <button onClick={() => dispatch({ type: 'NOTIF_CLEAR' })} className="text-xs text-sub hover:text-ink">Clear all</button>
          </div>
          {state.notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-sub">No notifications yet</div>
          ) : (
            <ul>
              {state.notifications.map(n => (
                <li key={n.id} className="px-4 py-3 border-b divider last:border-none">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{n.title}</div>
                      {n.body && <div className="text-xs text-sub mt-0.5">{n.body}</div>}
                    </div>
                    <span className="text-[10px] text-sub font-mono">{relTime(n.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
