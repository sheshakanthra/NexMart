import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, Cpu, Database, Radio, Sparkles } from 'lucide-react';

const LAYERS = [
  { title: 'Presentation Layer', icon: Layers, body: 'React 18 + React Router. Three routed modules (Customer / Vendor / Admin) plus a public Landing and Architecture. Every page is a first-class citizen with loading, empty, and error states.', chips: ['React 18', 'React Router', 'Framer Motion', 'Tailwind'] },
  { title: 'State & Data Layer', icon: Database, body: 'A single AppContext reducer holds stores, orders, cart, wishlist, addresses, notifications and simulator state. localStorage persists cart, wishlist, profile, addresses and theme across sessions.', chips: ['useReducer', 'localStorage', 'Mock catalog'] },
  { title: 'Realtime Sync Layer', icon: Radio, body: 'A single interval loop in AppContext simulates stock decrement, order progression through stages, and simulator-driven order generation. UI subscribes via context and re-renders on state change.', chips: ['setInterval', 'Order stages', 'Stock ticks'] },
  { title: 'AI Layer — Sentinel', icon: Sparkles, body: 'Mock inference over store inventory produces a daily brief (opportunity, risk, action) plus restock suggestions and a chat surface. Apply-actions mutate mock inventory in one tap.', chips: ['Daily brief', 'Restock suggestions', 'Chat'] },
  { title: 'Visualization Layer', icon: Cpu, body: 'Recharts drives every dashboard chart: revenue trend, hourly orders, category performance, forecast bands, funnel, peak heatmap. Sparklines are pure SVG.', chips: ['Recharts', 'SVG sparklines', 'Peak heatmap'] },
];

export default function Architecture() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="glass sticky top-0 z-40 border-b divider">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="arch-brand">
            <span className="w-6 h-6 rounded bg-brand"/>
            <span className="font-display font-bold text-lg">NexMart</span>
          </Link>
          <Link to="/" className="btn btn-ghost !h-9" data-testid="arch-back"><ArrowLeft size={14}/>Back</Link>
        </div>
      </header>

      <section className="grid-bg border-b divider">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <span className="chip"><Cpu size={12}/> System Overview</span>
          <h1 className="font-display font-black tracking-tighter mt-5 text-4xl md:text-6xl leading-tight">
            The <span className="text-brand">shape</span> of NexMart.
          </h1>
          <p className="mt-6 text-sub max-w-2xl">
            NexMart is a frontend-only hyperlocal marketplace OS. Everything you see runs on realistic
            mock data, a single state store, and a simulated realtime layer. Below is a structural map of
            the parts.
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 grid gap-4">
          {LAYERS.map((L) => (
            <div key={L.title} className="card p-6 grid md:grid-cols-12 gap-6" data-testid={`layer-${L.title.split(' ')[0].toLowerCase()}`}>
              <div className="md:col-span-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0"><L.icon size={18} /></div>
                <div>
                  <div className="label-mono">Layer</div>
                  <h3 className="font-display text-xl font-semibold mt-1">{L.title}</h3>
                </div>
              </div>
              <div className="md:col-span-9">
                <p className="text-sm text-sub leading-relaxed">{L.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {L.chips.map(c => <span key={c} className="chip font-mono">{c}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t divider">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Route map</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="card p-5">
              <div className="label-mono mb-2">Customer</div>
              <ul className="space-y-1">
                <li>/customer</li><li>/customer/nearby</li><li>/customer/store/:id</li>
                <li>/customer/product/:id</li><li>/customer/search</li><li>/customer/cart</li>
                <li>/customer/checkout</li><li>/customer/orders</li><li>/customer/order/:id</li>
                <li>/customer/profile</li><li>/customer/wishlist</li>
              </ul>
            </div>
            <div className="card p-5">
              <div className="label-mono mb-2">Vendor</div>
              <ul className="space-y-1">
                <li>/vendor</li><li>/vendor/orders</li><li>/vendor/inventory</li>
                <li>/vendor/inventory/add</li><li>/vendor/inventory/edit/:id</li>
                <li>/vendor/analytics</li><li>/vendor/sentinel</li><li>/vendor/store</li><li>/vendor/settings</li>
              </ul>
            </div>
            <div className="card p-5">
              <div className="label-mono mb-2">Admin</div>
              <ul className="space-y-1">
                <li>/admin</li><li>/admin/stream</li><li>/admin/demand</li>
                <li>/admin/vendors</li><li>/admin/approvals</li>
                <li>/admin/inventory-health</li><li>/admin/analytics</li>
                <li>/admin/simulator</li><li>/admin/settings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t divider">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between text-xs font-mono text-sub">
          <span>NexMart — Architecture Reference</span>
          <Link to="/" className="hover:text-ink">← Back to landing</Link>
        </div>
      </footer>
    </div>
  );
}
