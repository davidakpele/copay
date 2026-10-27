import { useState } from 'react';
import BillFormShell from '../../components/BillFormShell';
import { ELECTRICITY_PROVIDERS, ELECTRICITY_QUICK } from '../../data/bills';

const METER_TYPES = ['Prepaid', 'Postpaid'];

export default function ElectricityPage() {
  const [selectedProvider, setSelectedProvider] = useState(ELECTRICITY_PROVIDERS[0]);
  const [providerOpen,     setProviderOpen]     = useState(false);
  const [providerSearch,   setProviderSearch]   = useState('');
  const [meterNumber,      setMeterNumber]      = useState('');
  const [meterType,        setMeterType]        = useState(METER_TYPES[0]);
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
    if (!meterNumber || !amount) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1600);
  }

  const filteredProviders = ELECTRICITY_PROVIDERS.filter((p) =>
    p.name.toLowerCase().includes(providerSearch.toLowerCase())
  );

  if (done) {
    return (
      <BillFormShell title="Pay Electricity" bannerImage="/assets/images/electricity_bill.png">
        <div className="bfs-success">
          <div className="bfs-success__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Payment Successful!</h3>
          <p>₦{parseInt(amount).toLocaleString()} paid for meter {meterNumber} ({selectedProvider.name}).</p>
          <p className="bfs-success__ref">Ref: TXN{Date.now().toString().slice(-8)}</p>
          <button className="bfs-submit-btn" type="button" onClick={() => { setDone(false); setMeterNumber(''); setAmount(''); setSelectedQuick(null); }}>
            Pay Again
          </button>
        </div>
      </BillFormShell>
    );
  }

  return (
    <BillFormShell title="Pay Electricity" bannerImage="/assets/images/electricity_bill.png">

      <div className="bfs-field">
        <label>Select Disco (Provider)</label>
        <div className="bfs-select-box" onClick={() => setProviderOpen(true)}>
          <img src={selectedProvider.logo} alt={selectedProvider.name} className="bfs-select-box__logo"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <span className="bfs-select-box__name">{selectedProvider.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div className="bfs-field">
        <label>Meter Type</label>
        <div className="bfs-tab-group">
          {METER_TYPES.map((t) => (
            <button key={t} type="button"
              className={`bfs-tab-btn${meterType === t ? ' bfs-tab-btn--active' : ''}`}
              onClick={() => setMeterType(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bfs-field">
        <label>Meter Number</label>
        <input className="bfs-input" type="text" inputMode="numeric" placeholder="Enter meter number"
          value={meterNumber} onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, ''))} />
      </div>

      <div className="bfs-field">
        <label>Amount (₦)</label>
        <div className="bfs-quick-amounts">
          {ELECTRICITY_QUICK.map((q) => (
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

      <button className="bfs-submit-btn" type="button" disabled={!meterNumber || !amount || submitting} onClick={handleSubmit}>
        {submitting ? <><span className="bfs-spinner" /> Processing…</> : 'Pay Now'}
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
