import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Radio, Map, Users, Package2, LineChart, Zap, Settings, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationBell } from '../components/NotificationBell';
import { cn } from '../lib/utils';

const NAV = [
  { to: '/admin', label: 'Executive', icon: LayoutDashboard, end: true, testId: 'a-nav-dashboard' },
  { to: '/admin/stream', label: 'Live Stream', icon: Radio, testId: 'a-nav-stream' },
  { to: '/admin/demand', label: 'Demand Map', icon: Map, testId: 'a-nav-demand' },
  { to: '/admin/vendors', label: 'Vendors', icon: Users, testId: 'a-nav-vendors' },
  { to: '/admin/approvals', label: 'Approvals', icon: Store, testId: 'a-nav-approvals' },
  { to: '/admin/inventory-health', label: 'Inventory Health', icon: Package2, testId: 'a-nav-invhealth' },
  { to: '/admin/analytics', label: 'Analytics', icon: LineChart, testId: 'a-nav-analytics' },
  { to: '/admin/simulator', label: 'Simulator', icon: Zap, testId: 'a-nav-simulator' },
  { to: '/admin/settings', label: 'Settings', icon: Settings, testId: 'a-nav-settings' },
];

export default function AdminLayout() {
  const { state } = useApp();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-bg text-ink flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r divider bg-surface sticky top-0 h-screen">
        <button onClick={() => nav('/admin')} className="flex items-center gap-2 px-5 py-4 border-b divider" data-testid="a-brand">
          <span className="w-6 h-6 rounded bg-brand"/>
          <span className="font-display font-bold text-lg">NexMart</span>
          <span className="ml-auto label-mono">Admin</span>
        </button>
        <nav className="p-3 flex-1 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={n.testId}
              className={({ isActive }) => cn('flex items-center gap-2.5 px-3 py-2 rounded text-sm', isActive ? 'bg-muted text-ink' : 'text-sub hover:text-ink hover:bg-muted')}>
              <n.icon size={16} />{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t divider text-xs text-sub">
          Logged in as<br/>
          <span className="text-ink">{state.session?.name || 'Admin Demo'}</span>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass border-b divider">
          <div className="px-4 md:px-8 h-14 flex items-center justify-between">
            <div className="md:hidden flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-brand"/>
              <span className="font-display font-bold">NexMart</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="label-mono">Platform OS</span>
              {state.simulator.on && <span className="chip chip-warn">Simulator: {state.simulator.intensity}</span>}
            </div>
            <div className="flex items-center gap-1">
              <NotificationBell />
              <button onClick={() => nav('/admin/settings')} className="p-2 rounded hover:bg-muted" data-testid="a-settings-btn">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </header>

        <div className="md:hidden overflow-x-auto no-scrollbar border-b divider bg-surface">
          <div className="flex gap-1 px-3 py-2 min-w-max">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.end} data-testid={`m-${n.testId}`}
                className={({ isActive }) => cn('px-3 py-1.5 rounded text-xs whitespace-nowrap flex items-center gap-1.5', isActive ? 'bg-muted text-ink' : 'text-sub')}>
                <n.icon size={14} />{n.label}
              </NavLink>
            ))}
          </div>
        </div>

        <main className="p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
