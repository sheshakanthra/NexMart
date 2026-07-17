import React, { useMemo, useState } from 'react';
import { Check, X, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusChip } from '../../components/Chip';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/States';

export default function VendorApproval() {
  const { state, dispatch, toast } = useApp();
  const pending = useMemo(() => state.stores.filter(s => s.status === 'pending'), [state.stores]);
  const [reject, setReject] = useState(null);
  const [reason, setReason] = useState('');

  const approve = (s) => {
    dispatch({ type: 'UPDATE_STORE', payload: { storeId: s.id, patch: { status: 'active' } } });
    dispatch({ type: 'NOTIFY', payload: { title: 'Vendor approved', body: s.name, kind: 'admin' } });
    toast({ title: 'Vendor approved', body: s.name, kind: 'success' });
  };
  const doReject = () => {
    dispatch({ type: 'UPDATE_STORE', payload: { storeId: reject.id, patch: { status: 'suspended' } } });
    toast({ title: 'Vendor rejected', body: reason || 'No reason given', kind: 'info' });
    setReject(null); setReason('');
  };

  const requestInfo = (s) => toast({ title: 'Info requested', body: `Sent request to ${s.owner}.`, kind: 'info' });

  return (
    <div className="space-y-5" data-testid="approvals-page">
      <div>
        <div className="label-mono">Onboarding</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">Vendor approvals</h2>
        <p className="text-sub text-sm">{pending.length} stores waiting for review.</p>
      </div>

      {pending.length === 0 ? (
        <EmptyState title="Nothing to approve" body="Every incoming merchant has been reviewed."/>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {pending.map(s => (
            <div key={s.id} className="card p-5" data-testid={`app-${s.id}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="label-mono">Application</div>
                  <div className="font-display text-xl font-semibold mt-1">{s.name}</div>
                  <div className="text-xs text-sub mt-0.5">Owner: {s.owner} · {s.neighborhood}</div>
                </div>
                <StatusChip status={s.status}/>
              </div>
              <ul className="mt-4 text-sm space-y-2">
                {[
                  ['Business name', true],
                  ['Owner details', true],
                  ['Address & neighborhood', true],
                  ['Product categories', s.products.length > 0],
                  ['Bank / KYC documents', Math.random() > 0.4],
                ].map(([label, ok]) => (
                  <li key={label} className="flex items-center justify-between border-b divider py-1.5">
                    <span>{label}</span>
                    {ok ? <span className="chip chip-success !py-0"><Check size={10}/></span> : <span className="chip chip-warn !py-0">Missing</span>}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-1 mt-4">
                <button onClick={() => approve(s)} className="btn btn-primary !h-9 flex-1 justify-center" data-testid={`approve-${s.id}`}><Check size={14}/>Approve</button>
                <button onClick={() => setReject(s)} className="btn btn-ghost !h-9 !text-danger" data-testid={`reject-${s.id}`}><X size={14}/>Reject</button>
                <button onClick={() => requestInfo(s)} className="btn btn-ghost !h-9" data-testid={`info-${s.id}`}><MessageCircle size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!reject} onClose={() => setReject(null)} title={`Reject ${reject?.name}?`} size="sm"
        footer={<><button onClick={() => setReject(null)} className="btn btn-ghost">Cancel</button><button onClick={doReject} className="btn btn-primary !bg-danger" data-testid="reject-confirm">Reject</button></>}>
        <textarea value={reason} onChange={e => setReason(e.target.value)} className="input !h-24 pt-2" placeholder="Reason for rejection…" data-testid="reject-reason"/>
      </Modal>
    </div>
  );
}
