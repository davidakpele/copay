import { useState } from 'react';
import BillFormShell from '../../components/BillFormShell';
import { NETWORKS, AIRTIME_PROVIDERS, AIRTIME_QUICK } from '../../data/bills';

export default function AirtimePage() {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [networkOpen,     setNetworkOpen]     = useState(false);
  const [networkSearch,   setNetworkSearch]   = useState('');
  const [phone,           setPhone]           = useState('');
  const [amount,          setAmount]          = useState('');
  const [selectedQuick,   setSelectedQuick]   = useState<number | null>(null);
  const [submitting,      setSubmitting]       = useState(false);
  const [done,            setDone]            = useState(false);
  const [selectedProvider,setSelectedProvider]= useState<string | null>(null);

  const filteredNetworks = NETWORKS.filter((n) =>
    n.name.toLowerCase().includes(networkSearch.toLowerCase())
  );

  function handleQuick(v: number) { setSelectedQuick(v); setAmount(String(v)); }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value.replace(/\D/g, ''));
    setSelectedQuick(null);
  }

  function handleSubmit() {
    if (!phone || !amount) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1600);
  }

  function handleProviderSelect(id: string) {
    setSelectedProvider(id);
    const network = NETWORKS.find((n) => n.id === id);
    if (network) setSelectedNetwork(network);
  }

  if (done) {
    return (
      <BillFormShell title="Buy Airtime" bannerImage="/assets/images/airtime-banner.png">
        <div className="bfs-success">
          <div className="bfs-success__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Airtime Purchased!</h3>
          <p>₦{parseInt(amount).toLocaleString()} airtime sent to {phone} ({selectedNetwork.name}).</p>
          <p className="bfs-success__ref">Ref: TXN{Date.now().toString().slice(-8)}</p>
          <button className="bfs-submit-btn" type="button" onClick={() => { setDone(false); setPhone(''); setAmount(''); setSelectedQuick(null); }}>
            Buy Again
          </button>
        </div>
      </BillFormShell>
    );
  }

  return (
    <BillFormShell
      title="Buy Airtime"
      bannerImage="/assets/images/airtime-banner.png"
      providers={AIRTIME_PROVIDERS}
      selectedProvider={selectedProvider}
      onProviderSelect={handleProviderSelect}
    >
      <div className="bfs-field">
        <label>Select Network</label>
        <div className="bfs-select-box" onClick={() => setNetworkOpen(true)}>
          <span className="bfs-network-pill" style={{ background: selectedNetwork.bg, color: selectedNetwork.color }}>
            {selectedNetwork.abbr}
          </span>
          <span className="bfs-select-box__name">{selectedNetwork.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div className="bfs-field">
        <label>Phone Number</label>
        <input className="bfs-input" type="tel" inputMode="numeric" placeholder="e.g. 08012345678"
          value={phone} maxLength={11} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
      </div>

      <div className="bfs-field">
        <label>Amount (₦)</label>
        <div className="bfs-quick-amounts">
          {AIRTIME_QUICK.map((q) => (
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

      <button className="bfs-submit-btn" type="button" disabled={!phone || !amount || submitting} onClick={handleSubmit}>
        {submitting ? <><span className="bfs-spinner" /> Processing…</> : 'Buy Airtime'}
      </button>
      <p className="bfs-cashback-note">Earn up to 3% cashback when you buy airtime!</p>

      {networkOpen && (
        <div className="bfs-modal-overlay" onClick={() => setNetworkOpen(false)}>
          <div className="bfs-picker-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Network</h3>
            <input className="bfs-picker-search" type="search" placeholder="Search…"
              value={networkSearch} onChange={(e) => setNetworkSearch(e.target.value)} autoFocus />
            <div className="bfs-picker-list">
              {filteredNetworks.map((n) => (
                <button key={n.id} type="button" className="bfs-picker-item"
                  onClick={() => { setSelectedNetwork(n); setNetworkOpen(false); setNetworkSearch(''); }}>
                  <span className="bfs-network-pill" style={{ background: n.bg, color: n.color }}>{n.abbr}</span>
                  <span className="bfs-picker-item__name">{n.name}</span>
                  {selectedNetwork.id === n.id && (
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
