import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function NotFound() {
  const { state } = useApp();
  const nav = useNavigate();
  const roleHome = state.session ? `/${state.session.role}` : '/';
  return (
    <div className="min-h-screen bg-bg text-ink grid-bg grid place-items-center p-6">
      <div className="max-w-md text-center card p-10">
        <div className="font-mono text-xs label-mono">Error · 404</div>
        <h1 className="font-display text-6xl font-black mt-3 tracking-tighter">Off the map.</h1>
        <p className="text-sub mt-3 text-sm">This page isn’t in any neighborhood we cover.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button onClick={() => nav(-1)} className="btn btn-ghost" data-testid="nf-back">Go back</button>
          <Link to={roleHome} className="btn btn-primary" data-testid="nf-home">Take me home</Link>
        </div>
      </div>
    </div>
  );
}
