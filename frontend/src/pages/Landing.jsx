import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { ShoppingBag, Store, Shield, ArrowUpRight, Zap, Sparkles, MapPin, Radio, Package, LineChart } from 'lucide-react';
import { CountUp } from '../components/StatCard';
import { inr } from '../lib/utils';

function useTicker() {
  const [stats, setStats] = useState({ orders: 4820, stores: 328, neighborhoods: 42, gmv: 1240000 });
  useEffect(() => {
    const id = setInterval(() => {
      setStats(s => ({
        orders: s.orders + Math.floor(Math.random() * 4),
        stores: s.stores + (Math.random() < 0.15 ? 1 : 0),
        neighborhoods: s.neighborhoods,
        gmv: s.gmv + Math.floor(Math.random() * 1200),
      }));
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return stats;
}

const TICKER_ITEMS = [
  'Order #NM9241 · Basmati Rice · T. Nagar · ₹520',
  'Restock alert · Amul Paneer · Adyar',
  'New vendor approved · Amma Supermart · Anna Nagar',
  'Sentinel: +₹18,400 weekend opportunity',
  'Order #NM9256 · Aashirvaad Atta · Velachery · ₹435',
  'Stock-out risk · Nandini Ghee · Mylapore',
  'Rush hour detected · Besant Nagar · +42%',
  'Order #NM9270 · Toor Dal · Nungambakkam · ₹165',
];

export default function Landing() {
  const stats = useTicker();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b divider">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="landing-brand">
            <span className="w-6 h-6 rounded bg-brand"/>
            <span className="font-display font-bold text-lg">NexMart</span>
            <span className="hidden sm:inline label-mono ml-2">OS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#roles" className="text-sub hover:text-ink">Modules</a>
            <a href="#platform" className="text-sub hover:text-ink">Platform</a>
            <a href="#showcase" className="text-sub hover:text-ink">Showcase</a>
            <Link to="/architecture" className="text-sub hover:text-ink" data-testid="landing-nav-arch">Architecture</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="btn btn-ghost !h-9 hidden sm:inline-flex" data-testid="landing-login">Log in</Link>
            <Link to="/auth?tab=signup" className="btn btn-primary !h-9" data-testid="landing-signup">Get started<ArrowUpRight size={14}/></Link>
          </div>
        </div>
      </header>

      {/* Ticker */}
      <div className="border-b divider bg-surface2">
        <Marquee speed={40} gradient={false} pauseOnHover>
          <div className="flex gap-8 py-2 text-xs font-mono text-sub">
            {TICKER_ITEMS.concat(TICKER_ITEMS).map((t, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"/>{t}
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      {/* Hero */}
      <section className="grid-bg relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-28 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="chip chip-brand" data-testid="hero-tag"><Zap size={12}/> Hyperlocal Commerce OS</span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
              className="font-display font-black tracking-tighter mt-5 text-5xl md:text-7xl leading-[.95]">
              The scalable<br/>
              <span className="text-brand">neighborhood</span> marketplace.
            </motion.h1>
            <p className="mt-6 text-base md:text-lg text-sub max-w-2xl leading-relaxed">
              NexMart turns kirana stores into data-driven digital businesses. Customers discover live stock nearby. Vendors run a real-time command center with an AI copilot named <span className="text-ai">Sentinel</span>. Admins orchestrate a whole city of demand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth?role=customer" className="btn btn-primary" data-testid="cta-customer">Shop as Customer<ArrowUpRight size={14}/></Link>
              <Link to="/auth?role=vendor" className="btn btn-dark" data-testid="cta-vendor">Enter Vendor OS</Link>
              <Link to="/auth?role=admin" className="btn btn-ghost" data-testid="cta-admin">Admin Console</Link>
            </div>
          </div>

          {/* Live counters */}
          <div className="md:col-span-4 grid grid-cols-2 gap-3">
            <div className="card p-4">
              <div className="label-mono">Orders / today</div>
              <CountUp value={stats.orders} className="text-3xl mt-2" />
              <div className="text-[11px] text-success mt-1 font-mono">▲ live</div>
            </div>
            <div className="card p-4">
              <div className="label-mono">Active stores</div>
              <CountUp value={stats.stores} className="text-3xl mt-2" />
              <div className="text-[11px] text-sub mt-1 font-mono">across Chennai</div>
            </div>
            <div className="card p-4">
              <div className="label-mono">Neighborhoods</div>
              <CountUp value={stats.neighborhoods} className="text-3xl mt-2" />
              <div className="text-[11px] text-sub mt-1 font-mono">served today</div>
            </div>
            <div className="card p-4">
              <div className="label-mono">GMV today</div>
              <div className="mt-2 text-3xl font-mono">{inr(stats.gmv)}</div>
              <div className="text-[11px] text-success mt-1 font-mono">▲ +12.4%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="border-t divider">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="label-mono">Three-sided marketplace</div>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mt-2">Built for every seat at the table.</h2>
            </div>
            <div className="hidden md:block text-sm text-sub max-w-sm">Customer, Vendor, Admin — each module is a fully-designed OS with its own KPIs, tools and realtime signal.</div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <RoleCard
              testId="role-customer"
              tag="Customer"
              title="Neighborhood-first discovery"
              body="Live stock chips, distance-first browsing, natural-language search that turns 'ingredients for biryani for 6' into a cart."
              points={['Live stock meter on every product', 'Order tracking timeline in real time', 'Persistent cart, saved neighborhoods']}
              cta="Shop the demo"
              to="/auth?role=customer"
              icon={ShoppingBag}
            />
            <RoleCard
              testId="role-vendor"
              tag="Vendor"
              title="Command your store"
              body="One dashboard for stock, orders, analytics, and Sentinel — the AI copilot that surfaces the next best action."
              points={['Stage-based order board', 'Inline stock steppers + sparklines', 'Sentinel restock suggestions']}
              cta="Open Vendor OS"
              to="/auth?role=vendor"
              icon={Store}
              accent
            />
            <RoleCard
              testId="role-admin"
              tag="Admin"
              title="Run the whole city"
              body="Executive KPIs, demand-map heat zones, vendor approvals, and a simulator that stress-tests the marketplace."
              points={['Live order stream + ticker', 'Neighborhood heatmap', 'Simulator: rush hour / flash sale']}
              cta="Enter Admin console"
              to="/auth?role=admin"
              icon={Shield}
            />
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section id="platform" className="border-t divider bg-surface2">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="grid md:grid-cols-4 gap-4">
            <FeatItem icon={MapPin} label="Hyperlocal" body="Distance, radius and neighborhood drive discovery — not a global catalog." />
            <FeatItem icon={Radio}  label="Realtime"   body="Stock, orders and KPIs stream live. No refresh. No stale data." />
            <FeatItem icon={Sparkles} label="Sentinel AI" body="A copilot that surfaces opportunity, risk, and one-tap actions." />
            <FeatItem icon={LineChart} label="Every KPI" body="From line-item to city-wide GMV — every layer instrumented." />
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="border-t divider">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="label-mono">Product Showcase</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mt-2 max-w-3xl">A dense, opinionated OS — three surfaces, one marketplace.</h2>

          <div className="mt-10 grid md:grid-cols-12 gap-4">
            <ScreenTile testId="screen-vendor" title="Vendor Dashboard" subtitle="Command center" tone="brand" span="md:col-span-7"
              img="https://images.pexels.com/photos/12419503/pexels-photo-12419503.jpeg" />
            <ScreenTile testId="screen-customer" title="Customer Home" subtitle="Nearest to you" tone="default" span="md:col-span-5"
              img="https://images.pexels.com/photos/15741144/pexels-photo-15741144.jpeg" />
            <ScreenTile testId="screen-admin" title="Demand Map" subtitle="City-wide heat" tone="ai" span="md:col-span-5"
              img="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1200" />
            <ScreenTile testId="screen-sentinel" title="Sentinel AI" subtitle="Copilot for kirana" tone="ai" span="md:col-span-7"
              img="https://images.pexels.com/photos/36317181/pexels-photo-36317181.jpeg" />
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="border-t divider">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Try the whole marketplace in one click.</h2>
            <p className="mt-4 text-sub max-w-xl">No signup, no forms. Jump into any of the three modules with a fully-populated mock session.</p>
          </div>
          <div className="md:col-span-5 grid grid-cols-1 gap-2">
            <button onClick={() => nav('/auth?role=customer')} className="card p-4 flex items-center justify-between hover:border-ink/40" data-testid="cta-explore-customer">
              <div className="flex items-center gap-3"><ShoppingBag size={18}/><span className="font-medium">Explore as Customer</span></div>
              <ArrowUpRight size={16}/>
            </button>
            <button onClick={() => nav('/auth?role=vendor')} className="card p-4 flex items-center justify-between hover:border-ink/40" data-testid="cta-explore-vendor">
              <div className="flex items-center gap-3"><Store size={18}/><span className="font-medium">Explore as Vendor</span></div>
              <ArrowUpRight size={16}/>
            </button>
            <button onClick={() => nav('/auth?role=admin')} className="card p-4 flex items-center justify-between hover:border-ink/40" data-testid="cta-explore-admin">
              <div className="flex items-center gap-3"><Shield size={18}/><span className="font-medium">Explore as Admin</span></div>
              <ArrowUpRight size={16}/>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t divider bg-surface2">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-brand"/>
              <span className="font-display font-bold text-lg">NexMart</span>
            </div>
            <p className="text-sm text-sub mt-3 max-w-xs">Hyperlocal Commerce Operating System for neighborhood retail.</p>
          </div>
          <div>
            <div className="label-mono mb-3">Modules</div>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/auth?role=customer" className="text-sub hover:text-ink">Customer</Link></li>
              <li><Link to="/auth?role=vendor" className="text-sub hover:text-ink">Vendor OS</Link></li>
              <li><Link to="/auth?role=admin" className="text-sub hover:text-ink">Admin Console</Link></li>
            </ul>
          </div>
          <div>
            <div className="label-mono mb-3">Company</div>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/architecture" className="text-sub hover:text-ink" data-testid="footer-architecture">Architecture</Link></li>
              <li><a href="#" className="text-sub hover:text-ink">Careers</a></li>
              <li><a href="#" className="text-sub hover:text-ink">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="label-mono mb-3">Made with</div>
            <p className="text-sm text-sub">Realistic mock data · Chennai neighborhoods · Indian grocery context.</p>
          </div>
        </div>
        <div className="border-t divider">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between text-xs text-sub font-mono">
            <span>© 2026 NexMart Labs</span>
            <span>v1.0 · demo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RoleCard({ tag, title, body, points, cta, to, icon: Icon, accent, testId }) {
  return (
    <Link to={to} className={`card p-6 flex flex-col gap-4 hover:border-ink/50 transition-colors group ${accent ? 'bg-ink text-bg' : ''}`} data-testid={testId}>
      <div className="flex items-center justify-between">
        <span className={`chip ${accent ? '!border-white/20 !text-white/70' : ''}`}>{tag}</span>
        <Icon size={20} className={accent ? 'text-brand' : 'text-sub'} />
      </div>
      <h3 className={`font-display text-2xl font-bold leading-tight ${accent ? '' : ''}`}>{title}</h3>
      <p className={`text-sm ${accent ? 'text-white/70' : 'text-sub'}`}>{body}</p>
      <ul className={`text-sm space-y-1.5 mt-1 ${accent ? 'text-white/85' : 'text-ink'}`}>
        {points.map(p => <li key={p} className="flex items-start gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full ${accent ? 'bg-brand' : 'bg-brand'}`}/>{p}</li>)}
      </ul>
      <div className={`mt-auto flex items-center gap-1.5 text-sm font-medium ${accent ? 'text-brand' : ''} group-hover:translate-x-0.5 transition-transform`}>
        {cta} <ArrowUpRight size={14}/>
      </div>
    </Link>
  );
}

function FeatItem({ icon: Icon, label, body }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded bg-surface border divider flex items-center justify-center shrink-0"><Icon size={16} /></div>
      <div>
        <div className="font-medium">{label}</div>
        <p className="text-sm text-sub mt-0.5">{body}</p>
      </div>
    </div>
  );
}

function ScreenTile({ title, subtitle, tone, span, img, testId }) {
  const border = tone === 'brand' ? 'ring-1 ring-brand/40' : tone === 'ai' ? 'ring-1 ring-ai/40' : '';
  return (
    <div className={`card overflow-hidden ${span} ${border}`} data-testid={testId}>
      <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="label-mono text-white/70">{subtitle}</div>
            <div className="font-display text-white text-2xl font-bold">{title}</div>
          </div>
          <span className={`chip ${tone === 'brand' ? 'chip-brand' : tone === 'ai' ? 'chip-ai' : ''}`}>NexMart</span>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
        <span className="chip">Realtime</span>
        <span className="chip">Charts</span>
        <span className="chip">Mock data</span>
      </div>
    </div>
  );
}
