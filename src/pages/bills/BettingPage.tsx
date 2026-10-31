import { useState } from 'react';
import BillFormShell from '../../components/BillFormShell';
import { BETTING_PROVIDERS, BETTING_QUICK } from '../../data/bills';

export default function BettingPage() {
  const [selectedProvider, setSelectedProvider] = useState(BETTING_PROVIDERS[0]);
  const [providerOpen,     setProviderOpen]     = useState(false);
  const [providerSearch,   setProviderSearch]   = useState('');
  const [userId,           setUserId]           = useState('');
  const [amount,           setAmount]           = useState('');
  const [selectedQuick,    setSelectedQuick]    = useState<number | null>(null);
  const [submitting,       setSubmitting]       = useState(false);
  const [done,             setDone]             = useState(false);

  function handleQuick(v: number) { setSelectedQuick(v); setAmount(String(v)); }
  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value.replace(/\D/g, ''));
    setSelectedQuick(null);
  }

  function handleSubmit() {
    if (!userId || !amount) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1600);
  }

  const filteredProviders = BETTING_PROVIDERS.filter((p) =>
    p.name.toLowerCase().includes(providerSearch.toLowerCase())
  );

  if (done) {
    return (
      <BillFormShell title="Fund Betting Wallet" bannerImage="/assets/images/betting-bills.png">
        <div className="bfs-success">
          <div className="bfs-success__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Wallet Funded!</h3>
          <p>₦{parseInt(amount).toLocaleString()} added to {selectedProvider.name} account {userId}.</p>
          <p className="bfs-success__ref">Ref: TXN{Date.now().toString().slice(-8)}</p>
          <button className="bfs-submit-btn" type="button" onClick={() => { setDone(false); setUserId(''); setAmount(''); setSelectedQuick(null); }}>
            Fund Again
          </button>
        </div>
      </BillFormShell>
    );
  }

  return (
    <BillFormShell
      title="Fund Betting Wallet"
      bannerImage="/assets/images/betting-bills.png"
      providers={BETTING_PROVIDERS}
      selectedProvider={selectedProvider.id}
      onProviderSelect={(id) => {
        const p = BETTING_PROVIDERS.find((x) => x.id === id);
        if (p) setSelectedProvider(p);
      }}
    >
      <div className="bfs-field">
        <label>Select Betting Platform</label>
        <div className="bfs-select-box" onClick={() => setProviderOpen(true)}>
          <img src={selectedProvider.logo} alt={selectedProvider.name} className="bfs-select-box__logo"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <span className="bfs-select-box__name">{selectedProvider.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div className="bfs-field">
        <label>User ID / Username</label>
        <input className="bfs-input" type="text" placeholder="Enter your betting user ID"
          value={userId} onChange={(e) => setUserId(e.target.value)} />
      </div>

      <div className="bfs-field">
        <label>Amount (₦)</label>
        <div className="bfs-quick-amounts">
          {BETTING_QUICK.map((q) => (
            <button key={q} type="button"
              className={`bfs-quick-btn${selectedQuick === q ? ' bfs-quick-btn--active' : ''}`}
              onClick={() => handleQuick(q)}>
              ₦{q.toLocaleString()}
            </button>
          ))}
        </div>
        <input className="bfs-input bfs-input--mt" type="text" inputMode="numeric"
          placeholder="Or enter custom amount"
          value={amount ? `₦${parseInt(amount).toLocaleString()}` : ''}
          onChange={handleAmountChange} />
      </div>

      <button className="bfs-submit-btn" type="button" disabled={!userId || !amount || submitting} onClick={handleSubmit}>
        {submitting ? <><span className="bfs-spinner" /> Processing…</> : 'Fund Wallet'}
      </button>

      {providerOpen && (
        <div className="bfs-modal-overlay" onClick={() => setProviderOpen(false)}>
          <div className="bfs-picker-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Platform</h3>
            <input className="bfs-picker-search" type="search" placeholder="Search…"
              value={providerSearch} onChange={(e) => setProviderSearch(e.target.value)} autoFocus />
            <div className="bfs-picker-list">
              {filteredProviders.map((p) => (
                <button key={p.id} type="button" className="bfs-picker-item"
                  onClick={() => { setSelectedProvider(p); setProviderOpen(false); setProviderSearch(''); }}>
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
    </BillFormShell>
  );
}
