import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Package, LineChart, Sparkles, Store, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationBell } from '../components/NotificationBell';
import { cn } from '../lib/utils';

const NAV = [
  { to: '/vendor', label: 'Dashboard', icon: LayoutDashboard, end: true, testId: 'v-nav-dashboard' },
  { to: '/vendor/orders', label: 'Orders', icon: ClipboardList, testId: 'v-nav-orders', badge: 'orders' },
  { to: '/vendor/inventory', label: 'Inventory', icon: Package, testId: 'v-nav-inventory' },
  { to: '/vendor/analytics', label: 'Analytics', icon: LineChart, testId: 'v-nav-analytics' },
  { to: '/vendor/sentinel', label: 'Sentinel AI', icon: Sparkles, testId: 'v-nav-sentinel' },
  { to: '/vendor/store', label: 'Store Profile', icon: Store, testId: 'v-nav-store' },
  { to: '/vendor/settings', label: 'Settings', icon: Settings, testId: 'v-nav-settings' },
];

export default function VendorLayout() {
  const { state } = useApp();
  const nav = useNavigate();
  const storeId = state.session?.storeId || 's_0';
  const newOrders = state.orders.filter(o => o.storeId === storeId && o.status === 'placed').length;

  return (
    <div className="min-h-screen bg-bg text-ink flex">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r divider bg-surface sticky top-0 h-screen">
        <button onClick={() => nav('/vendor')} className="flex items-center gap-2 px-5 py-4 border-b divider" data-testid="v-brand">
          <span className="w-6 h-6 rounded bg-brand"/>
          <span className="font-display font-bold text-lg">NexMart</span>
          <span className="ml-auto label-mono">Vendor</span>
        </button>
        <nav className="p-3 flex-1 flex flex-col gap-1">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={n.testId}
              className={({ isActive }) => cn('flex items-center gap-2.5 px-3 py-2 rounded text-sm', isActive ? 'bg-muted text-ink' : 'text-sub hover:text-ink hover:bg-muted')}>
              <n.icon size={16} />
              <span className="flex-1">{n.label}</span>
              {n.badge === 'orders' && newOrders > 0 && (
                <span className="chip chip-brand !py-0 !px-1.5 text-[10px]">{newOrders}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t divider text-xs text-sub">
          Logged in as<br/>
          <span className="text-ink">{state.session?.name || 'Vendor Demo'}</span>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass border-b divider">
          <div className="px-4 md:px-8 h-14 flex items-center justify-between">
            <div className="md:hidden flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-brand"/>
              <span className="font-display font-bold">NexMart</span>
            </div>
            <div className="hidden md:block label-mono">Vendor Command Center</div>
            <div className="flex items-center gap-1">
              <NotificationBell />
              <button onClick={() => nav('/vendor/settings')} className="p-2 rounded hover:bg-muted" data-testid="v-settings-btn">
                <Settings size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile top nav */}
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
