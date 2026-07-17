import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusChip } from '../../components/Chip';
import { NEIGHBORHOODS } from '../../data/mock';
import { inr, relTime, uid } from '../../lib/utils';

export default function LiveStream() {
  const { state } = useApp();
  const [paused, setPaused] = useState(false);
  const [eventFilter, setEventFilter] = useState('all');
  const [nbFilter, setNbFilter] = useState('all');
  const [events, setEvents] = useState(() => state.orders.slice(0, 12).map(o => ({ id: uid('e'), kind: 'placed', order: o, at: o.placedAt })));
  const seenRef = useRef(new Set(events.map(e => e.order.id)));

  // Add new orders as they arrive
  useEffect(() => {
    if (paused) return;
    const newest = state.orders.slice(0, 6);
    const added = [];
    for (const o of newest) {
      if (!seenRef.current.has(o.id)) {
        seenRef.current.add(o.id);
        added.push({ id: uid('e'), kind: 'placed', order: o, at: Date.now() });
      }
    }
    if (added.length) setEvents(prev => [...added, ...prev].slice(0, 60));
    // eslint-disable-next-line
  }, [state.orders, paused]);

  const filtered = useMemo(() => events.filter(e => (eventFilter === 'all' || e.kind === eventFilter) && (nbFilter === 'all' || e.order.neighborhood === nbFilter)), [events, eventFilter, nbFilter]);

  const sessionCount = events.length;
  const sessionRevenue = events.reduce((a, e) => a + e.order.total, 0);

  return (
    <div className="space-y-5" data-testid="live-stream-page">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono">Realtime</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Live order stream</h2>
          <p className="text-sub text-sm">Every event across the platform, streaming as they happen.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPaused(p => !p)} className="btn btn-ghost" data-testid="stream-pause">
            {paused ? <><Play size={14}/>Resume</> : <><Pause size={14}/>Pause</>}
          </button>
          <button onClick={() => { setEvents([]); seenRef.current = new Set(); }} className="btn btn-ghost" data-testid="stream-clear"><Trash2 size={14}/>Clear</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4"><div className="label-mono">Session events</div><div className="font-mono text-2xl mt-1">{sessionCount}</div></div>
        <div className="card p-4"><div className="label-mono">Session revenue</div><div className="font-mono text-2xl mt-1">{inr(sessionRevenue)}</div></div>
        <div className="card p-4"><div className="label-mono">Status</div><div className="mt-1">{paused ? <span className="chip chip-warn">Paused</span> : <span className="chip chip-success pulse-dot inline-flex items-center gap-2"><span/>Streaming</span>}</div></div>
        <div className="card p-4"><div className="label-mono">Filters</div><div className="text-sm mt-1 font-mono">{eventFilter} · {nbFilter}</div></div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="stream-event-filter">
          <option value="all">All events</option>
          <option value="placed">Placed</option>
          <option value="accepted">Accepted</option>
          <option value="delivered">Delivered</option>
        </select>
        <select value={nbFilter} onChange={e => setNbFilter(e.target.value)} className="chip cursor-pointer bg-surface" data-testid="stream-nb-filter">
          <option value="all">All neighborhoods</option>
          {NEIGHBORHOODS.map(n => <option key={n}>{n}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="px-4 py-2 border-b divider label-mono">Feed</div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sub text-sm">No events yet. New orders will appear here.</div>
        ) : (
          <ul>
            {filtered.map(e => (
              <li key={e.id} className="px-4 py-3 border-b divider last:border-none flex items-center gap-4">
                <span className="pulse-dot inline-flex"><span/></span>
                <div className="flex-1 min-w-0 grid md:grid-cols-4 gap-2 items-center">
                  <div className="font-mono text-xs">#{e.order.id}</div>
                  <div className="text-sm truncate">{e.order.storeName}</div>
                  <div className="text-xs text-sub">{e.order.neighborhood}</div>
                  <div className="flex items-center gap-2 justify-between">
                    <StatusChip status={e.order.status}/>
                    <span className="font-mono text-sm">{inr(e.order.total)}</span>
                  </div>
                </div>
                <span className="text-[10px] text-sub font-mono whitespace-nowrap">{relTime(e.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
