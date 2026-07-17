import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingCart, ClipboardList, User, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationBell } from '../components/NotificationBell';
import { cn } from '../lib/utils';

const NAV = [
  { to: '/customer', label: 'Home', icon: Home, end: true, testId: 'nav-home' },
  { to: '/customer/nearby', label: 'Stores', icon: Store, testId: 'nav-nearby' },
  { to: '/customer/search', label: 'Search', icon: Search, testId: 'nav-search' },
  { to: '/customer/orders', label: 'Orders', icon: ClipboardList, testId: 'nav-orders' },
  { to: '/customer/profile', label: 'Profile', icon: User, testId: 'nav-profile' },
];

export default function CustomerLayout() {
  const { state } = useApp();
  const nav = useNavigate();
  const cartCount = state.cart.reduce((a, i) => a + i.qty, 0);
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-40 glass border-b divider">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <button onClick={() => nav('/customer')} className="flex items-center gap-2" data-testid="brand-nexmart">
            <span className="w-6 h-6 rounded bg-brand"/>
            <span className="font-display font-bold text-lg tracking-tight">NexMart</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.slice(0, 4).map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} data-testid={n.testId}
                className={({ isActive }) => cn('px-3 py-1.5 rounded text-sm', isActive ? 'bg-muted text-ink' : 'text-sub hover:text-ink hover:bg-muted')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={() => nav('/customer/cart')} className="relative p-2 rounded hover:bg-muted" data-testid="nav-cart">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-brand-fg text-[10px] font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <NotificationBell />
            <button onClick={() => nav('/customer/profile')} className="p-2 rounded hover:bg-muted" data-testid="nav-avatar">
              <User size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t divider">
        <div className="grid grid-cols-5">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={`m-${n.testId}`}
              className={({ isActive }) => cn('flex flex-col items-center gap-1 py-2.5 text-[11px]', isActive ? 'text-ink' : 'text-sub')}>
              <n.icon size={18} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
