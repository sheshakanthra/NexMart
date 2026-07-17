import React from 'react';
import { Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const INTENSITY = [
  { key: 'normal', label: 'Normal', desc: 'Steady baseline traffic.' },
  { key: 'rush', label: 'Rush hour', desc: 'Mimics 7–9 PM evening peak.' },
  { key: 'flash', label: 'Flash sale', desc: '3x order velocity, aggressive stock burn.' },
];

export default function Simulator() {
  const { state, dispatch, toast } = useApp();
  const sim = state.simulator;

  return (
    <div className="space-y-5" data-testid="simulator-page">
      <div>
        <div className="label-mono">Load lab</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Demand simulator</h2>
        <p className="text-sub text-sm">Generate mock platform activity to stress-test dashboards.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="card p-5">
          <div className="label-mono">Status</div>
          <div className="mt-2 flex items-center gap-3">
            <span className={cn('w-3 h-3 rounded-full', sim.on ? 'bg-success animate-pulseDot' : 'bg-line')}/>
            <span className="font-medium">{sim.on ? 'Running' : 'Idle'}</span>
          </div>
          <div className="mt-6 flex gap-2">
            {!sim.on ? (
              <button onClick={() => { dispatch({ type: 'SIM_SET', payload: { on: true } }); toast({ title: 'Simulation started', kind: 'success' }); }} className="btn btn-primary" data-testid="sim-start"><Play size={14}/>Start</button>
            ) : (
              <button onClick={() => { dispatch({ type: 'SIM_SET', payload: { on: false } }); toast({ title: 'Simulation stopped', kind: 'info' }); }} className="btn btn-ghost" data-testid="sim-stop"><Pause size={14}/>Stop</button>
            )}
            <button onClick={() => { dispatch({ type: 'SIM_SET', payload: { generated: 0 } }); toast({ title: 'Counters reset', kind: 'info' }); }} className="btn btn-ghost" data-testid="sim-reset"><RotateCcw size={14}/>Reset</button>
          </div>
        </div>

        <div className="card p-5 md:col-span-2">
          <div className="label-mono">Intensity</div>
          <div className="grid md:grid-cols-3 gap-2 mt-2">
            {INTENSITY.map(i => (
              <button key={i.key} onClick={() => dispatch({ type: 'SIM_SET', payload: { intensity: i.key } })}
                className={cn('card p-4 text-left hover:border-ink/40', sim.intensity === i.key && 'ring-1 ring-brand')}
                data-testid={`sim-int-${i.key}`}>
                <div className="flex items-center gap-2"><Zap size={14}/><span className="font-medium">{i.label}</span></div>
                <div className="text-xs text-sub mt-1">{i.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4"><div className="label-mono">Orders generated</div><div className="font-mono text-3xl mt-1">{sim.generated}</div></div>
        <div className="card p-4"><div className="label-mono">Intensity</div><div className="font-mono text-3xl mt-1 capitalize">{sim.intensity}</div></div>
        <div className="card p-4"><div className="label-mono">Affecting</div><div className="text-xs mt-1 text-sub">Executive · Vendor · Live Stream</div></div>
        <div className="card p-4"><div className="label-mono">Tick</div><div className="font-mono text-3xl mt-1">~3.5s</div></div>
      </div>

      <div className="card p-5">
        <div className="label-mono">What it affects</div>
        <ul className="mt-3 text-sm space-y-2">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand"/> Live Order Stream feed accelerates and starts filling with generated orders</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand"/> Executive Dashboard KPIs (GMV, orders, ticker) update more frequently</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand"/> Vendor Dashboards receive incoming orders in the "New" stage</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand"/> Stock quantities decrement faster across stores</li>
        </ul>
      </div>
    </div>
  );
}
