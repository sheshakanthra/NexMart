import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

// Count-up hook
export function CountUp({ value, duration = 900, className, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = Number(display) || 0;
    const to = Number(value) || 0;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      setDisplay(v);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [value]);
  const shown = decimals ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-IN');
  return <span className={cn('font-mono tabular-nums', className)}>{prefix}{shown}{suffix}</span>;
}

export function StatCard({ label, value, prefix = '', suffix = '', sub, tone, spark, realtime = false }) {
  return (
    <div className="card p-5 flex flex-col gap-3 relative overflow-hidden" data-testid={`stat-${(label || '').toLowerCase().replace(/\s+/g,'-')}`}>
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        {realtime && <span className="pulse-dot inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-sub"><span/>&nbsp;Live</span>}
      </div>
      <div className="flex items-end gap-2">
        <CountUp value={value} prefix={prefix} suffix={suffix} className="text-3xl md:text-4xl font-medium leading-none" />
      </div>
      {sub && <div className={cn('text-xs font-mono', tone === 'up' ? 'text-success' : tone === 'down' ? 'text-danger' : 'text-sub')}>{sub}</div>}
      {spark && <div className="absolute right-3 bottom-3 opacity-70">{spark}</div>}
    </div>
  );
}
