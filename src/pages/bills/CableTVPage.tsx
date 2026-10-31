import { useState } from 'react';
import BillFormShell from '../../components/BillFormShell';
import { TV_PROVIDERS, getPlansForProvider } from '../../data/bills';

export default function CableTVPage() {
  const [selectedProvider, setSelectedProvider] = useState(TV_PROVIDERS[0]);
  const [providerOpen,     setProviderOpen]     = useState(false);
  const [providerSearch,   setProviderSearch]   = useState('');
  const [smartCard,        setSmartCard]        = useState('');
  const [selectedPlan,     setSelectedPlan]     = useState<string | null>(null);
  const [planOpen,         setPlanOpen]         = useState(false);
  const [planSearch,       setPlanSearch]       = useState('');
  const [submitting,       setSubmitting]       = useState(false);
  const [done,             setDone]             = useState(false);

  const plans = getPlansForProvider(selectedProvider.id);
  const plan  = plans.find((p) => p.value === selectedPlan);

  const filteredProviders = TV_PROVIDERS.filter((p) =>
    p.name.toLowerCase().includes(providerSearch.toLowerCase())
  );
  const filteredPlans = plans.filter((p) =>
    p.name.toLowerCase().includes(planSearch.toLowerCase())
  );

  function handleSubmit() {
    if (!smartCard || !selectedPlan) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1600);
  }

  if (done) {
    return (
      <BillFormShell title="Cable TV" bannerImage="/assets/images/cabletv-banner.png">
        <div className="bfs-success">
          <div className="bfs-success__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Subscription Renewed!</h3>
          <p>{plan?.name} for {selectedProvider.name} — Smart card {smartCard}.</p>
          <p className="bfs-success__ref">Ref: TXN{Date.now().toString().slice(-8)}</p>
          <button className="bfs-submit-btn" type="button" onClick={() => { setDone(false); setSmartCard(''); setSelectedPlan(null); }}>
            Pay Again
          </button>
        </div>
      </BillFormShell>
    );
  }

  return (
    <BillFormShell title="Cable TV" bannerImage="/assets/images/cabletv-banner.png">

      <div className="bfs-field">
        <label>Select Provider</label>
        <div className="bfs-select-box" onClick={() => setProviderOpen(true)}>
          <img src={selectedProvider.logo} alt={selectedProvider.name} className="bfs-select-box__logo"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <span className="bfs-select-box__name">{selectedProvider.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div className="bfs-field">
        <label>Smart Card / IUC Number</label>
        <input className="bfs-input" type="text" inputMode="numeric" placeholder="Enter smart card number"
          value={smartCard} onChange={(e) => setSmartCard(e.target.value.replace(/\D/g, ''))} />
      </div>

      <div className="bfs-field">
        <label>Select Plan</label>
        <div className="bfs-select-box" onClick={() => setPlanOpen(true)}>
          <span className="bfs-select-box__name">
            {plan ? `${plan.name} — ₦${plan.price.toLocaleString()}` : 'Choose a plan'}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>
      <button className="bfs-submit-btn" type="button" disabled={!smartCard || !selectedPlan || submitting} onClick={handleSubmit}>
        {submitting ? <><span className="bfs-spinner" /> Processing…</> : 'Subscribe Now'}
      </button>

      {providerOpen && (
        <div className="bfs-modal-overlay" onClick={() => setProviderOpen(false)}>
          <div className="bfs-picker-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Provider</h3>
            <input className="bfs-picker-search" type="search" placeholder="Search…"
              value={providerSearch} onChange={(e) => setProviderSearch(e.target.value)} autoFocus />
            <div className="bfs-picker-list">
              {filteredProviders.map((p) => (
                <button key={p.id} type="button" className="bfs-picker-item"
                  onClick={() => { setSelectedProvider(p); setSelectedPlan(null); setProviderOpen(false); setProviderSearch(''); }}>
                  <img src={p.logo} alt={p.name} className="bfs-picker-item__logo"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  <span className="bfs-picker-item__name">{p.name}</span>
                  {selectedProvider.id === p.id && (
                    <span className="bfs-picker-item__check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {planOpen && (
        <div className="bfs-modal-overlay" onClick={() => setPlanOpen(false)}>
          <div className="bfs-picker-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Plan</h3>
            <input className="bfs-picker-search" type="search" placeholder="Search plan…"
              value={planSearch} onChange={(e) => setPlanSearch(e.target.value)} autoFocus />
            <div className="bfs-picker-list">
              {filteredPlans.map((p) => (
                <button key={p.value} type="button" className="bfs-picker-item"
                  onClick={() => { setSelectedPlan(p.value); setPlanOpen(false); setPlanSearch(''); }}>
                  <span className="bfs-picker-item__name">{p.name}</span>
                  <span className="bfs-picker-item__price">₦{p.price.toLocaleString()}</span>
                  {selectedPlan === p.value && (
                    <span className="bfs-picker-item__check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </BillFormShell>
  );
}
