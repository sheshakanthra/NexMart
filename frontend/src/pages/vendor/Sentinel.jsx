import React, { useMemo, useState } from 'react';
import { Sparkles, RefreshCcw, Check, X, ArrowUp, ArrowDown, Zap, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sentinelSuggestions, SENTINEL_BRIEF } from '../../data/mock';
import { cn } from '../../lib/utils';

const ICONS = { opportunity: ArrowUp, risk: ArrowDown, action: Zap };
const TONES = { opportunity: 'text-success', risk: 'text-danger', action: 'text-ai' };

export default function Sentinel() {
  const { state, dispatch, toast } = useApp();
  const storeId = state.session?.storeId || 's_0';
  const store = state.stores.find(s => s.id === storeId) || state.stores[0];
  const [brief, setBrief] = useState(SENTINEL_BRIEF);
  const [suggestions, setSuggestions] = useState(sentinelSuggestions(store.products));
  const [chat, setChat] = useState([{ role: 'assistant', text: `Hi ${state.session?.name || 'there'} — I'm Sentinel. Ask me anything about ${store.name}.` }]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const apply = (sug) => {
    dispatch({ type: 'UPDATE_STOCK', payload: { storeId, productId: sug.productId, stock: sug.currentStock + sug.suggestedQty } });
    setSuggestions(s => s.filter(x => x.id !== sug.id));
    toast({ title: 'Restock applied', body: `+${sug.suggestedQty} ${sug.productName}`, kind: 'success' });
  };
  const dismiss = (sug) => setSuggestions(s => s.filter(x => x.id !== sug.id));

  const regenerate = () => {
    setBrief(SENTINEL_BRIEF.map(b => ({ ...b, id: b.id + '_' + Math.random().toString(36).slice(2, 5) })));
    setSuggestions(sentinelSuggestions(store.products));
    toast({ title: 'Sentinel refreshed', kind: 'success' });
  };

  const send = () => {
    if (!msg.trim()) return;
    const q = msg;
    setChat(c => [...c, { role: 'user', text: q }]);
    setMsg('');
    setBusy(true);
    setTimeout(() => {
      const reply = mockAnswer(q, store);
      setChat(c => [...c, { role: 'assistant', text: reply }]);
      setBusy(false);
    }, 800);
  };

  return (
    <div className="space-y-6" data-testid="sentinel-page">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-mono text-ai flex items-center gap-2"><Sparkles size={12}/> Sentinel</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Your AI copilot</h2>
          <p className="text-sub text-sm">Insights that lead to actions. Applied changes update your store instantly.</p>
        </div>
        <button onClick={regenerate} className="btn btn-ghost" data-testid="sentinel-regen"><RefreshCcw size={14}/>Regenerate brief</button>
      </div>

      {/* Daily brief */}
      <section>
        <div className="label-mono">Daily brief</div>
        <div className="grid md:grid-cols-3 gap-3 mt-2">
          {brief.map(b => {
            const Icon = ICONS[b.type];
            return (
              <div key={b.id} className="sentinel-border p-5" data-testid={`brief-${b.type}`}>
                <div className="flex items-center justify-between">
                  <span className={cn('chip chip-ai capitalize', TONES[b.type])}><Icon size={12}/>{b.type}</span>
                  <span className="font-mono text-sm">{b.metric}</span>
                </div>
                <div className="font-display text-lg font-semibold mt-2">{b.title}</div>
                <p className="text-sm text-sub mt-1">{b.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Restock suggestions */}
      <section>
        <div className="flex items-center justify-between">
          <div className="label-mono">Restock suggestions</div>
          <div className="text-xs text-sub">{suggestions.length} pending</div>
        </div>
        {suggestions.length === 0 ? (
          <div className="card p-6 text-center text-sm text-sub mt-2">All suggestions applied. Sentinel will resurface as new signals appear.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3 mt-2">
            {suggestions.map(s => (
              <div key={s.id} className="card p-4 flex items-start gap-4" data-testid={`sug-${s.id}`}>
                <div className="w-10 h-10 rounded bg-ai/10 text-ai flex items-center justify-center shrink-0"><Sparkles size={16}/></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.productName}</div>
                  <div className="text-xs text-sub mt-1">{s.reason}</div>
                  <div className="text-xs font-mono mt-2 text-ai">Current: {s.currentStock} → suggest +{s.suggestedQty}</div>
                  <div className="flex items-center gap-1 mt-3">
                    <button onClick={() => apply(s)} className="btn btn-primary !h-8 text-xs" data-testid={`apply-${s.id}`}><Check size={12}/>Apply</button>
                    <button onClick={() => dismiss(s)} className="btn btn-ghost !h-8 text-xs" data-testid={`dismiss-${s.id}`}><X size={12}/>Dismiss</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Chat */}
      <section className="card sentinel-border">
        <div className="px-5 py-3 border-b border-ai/20 flex items-center justify-between">
          <div className="label-mono text-ai flex items-center gap-2"><Sparkles size={12}/>Ask Sentinel</div>
          <div className="text-xs text-sub">Mock responses · no real API</div>
        </div>
        <div className="p-5 space-y-3 max-h-80 overflow-y-auto" data-testid="chat-thread">
          {chat.map((m, i) => (
            <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[85%] px-3 py-2 rounded text-sm', m.role === 'user' ? 'bg-ink text-bg' : 'bg-muted')}>{m.text}</div>
            </div>
          ))}
          {busy && <div className="text-xs text-sub font-mono">Sentinel is thinking…</div>}
        </div>
        <div className="p-3 border-t border-ai/20 flex gap-2">
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="input" placeholder="What are my best-selling items this week?" data-testid="chat-input"/>
          <button onClick={send} className="btn btn-dark" data-testid="chat-send"><Send size={14}/></button>
        </div>
      </section>
    </div>
  );
}

function mockAnswer(q, store) {
  const s = q.toLowerCase();
  if (s.includes('best') || s.includes('top')) return `Your top three today at ${store.name} are: ${store.products.slice(0,3).map(p => p.name).join(', ')}. Together they've generated ~₹4,200 in the last 6 hours.`;
  if (s.includes('low') || s.includes('stock')) return `You currently have ${store.products.filter(p => p.stock <= p.threshold).length} low-stock items. Head to Inventory to bulk-adjust.`;
  if (s.includes('revenue')) return `Yesterday's revenue was ~₹28,400. Today is trending +12% higher — likely to close near ₹31,800.`;
  if (s.includes('why') || s.includes('recommend')) return `Based on recent order velocity in ${store.neighborhood}, I'd prioritize staples and dairy. Basmati and paneer are moving fastest.`;
  return `I don't have real data for that — but in the demo, the answer would be based on the last 30 days of your store's orders and stock.`;
}
