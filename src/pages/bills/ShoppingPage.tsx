import { useState } from 'react';
import BillFormShell from '../../components/BillFormShell';
import { SHOPPING_PROVIDERS, SHOPPING_QUICK } from '../../data/bills';

const PAYMENT_OPTIONS = ['Wallet Balance', 'Bank Transfer', 'Card Payment'];

export default function ShoppingPage() {
  const [selectedProvider, setSelectedProvider] = useState(SHOPPING_PROVIDERS[0]);
  const [providerOpen,     setProviderOpen]     = useState(false);
  const [providerSearch,   setProviderSearch]   = useState('');
  const [orderId,          setOrderId]          = useState('');
  const [paymentMethod,    setPaymentMethod]    = useState(PAYMENT_OPTIONS[0]);
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
    if (!orderId || !amount) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1600);
  }

  const filteredProviders = SHOPPING_PROVIDERS.filter((p) =>
    p.name.toLowerCase().includes(providerSearch.toLowerCase())
  );

  if (done) {
    return (
      <BillFormShell title="Shopping Payment" bannerImage="/assets/images/shopping-bills.png">
        <div className="bfs-success">
          <div className="bfs-success__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Payment Successful!</h3>
          <p>₦{parseInt(amount).toLocaleString()} paid to {selectedProvider.name} for order {orderId}.</p>
          <p className="bfs-success__ref">Ref: TXN{Date.now().toString().slice(-8)}</p>
          <button className="bfs-submit-btn" type="button" onClick={() => { setDone(false); setOrderId(''); setAmount(''); setSelectedQuick(null); }}>
            Pay Again
          </button>
        </div>
      </BillFormShell>
    );
  }

  return (
    <BillFormShell
      title="Shopping Payment"
      bannerImage="/assets/images/shopping-bills.png"
      providers={SHOPPING_PROVIDERS}
      selectedProvider={selectedProvider.id}
      onProviderSelect={(id) => {
        const p = SHOPPING_PROVIDERS.find((x) => x.id === id);
        if (p) setSelectedProvider(p);
      }}
    >
      <div className="bfs-field">
        <label>Select Platform</label>
        <div className="bfs-select-box" onClick={() => setProviderOpen(true)}>
          <img src={selectedProvider.logo} alt={selectedProvider.name} className="bfs-select-box__logo"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <span className="bfs-select-box__name">{selectedProvider.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div className="bfs-field">
        <label>Order ID / Reference</label>
        <input className="bfs-input" type="text" placeholder="Enter order ID or reference"
          value={orderId} onChange={(e) => setOrderId(e.target.value)} />
      </div>

      <div className="bfs-field">
        <label>Payment Method</label>
        <div className="bfs-tab-group bfs-tab-group--wrap">
          {PAYMENT_OPTIONS.map((opt) => (
            <button key={opt} type="button"
              className={`bfs-tab-btn${paymentMethod === opt ? ' bfs-tab-btn--active' : ''}`}
              onClick={() => setPaymentMethod(opt)}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="bfs-field">
        <label>Amount (₦)</label>
        <div className="bfs-quick-amounts">
          {SHOPPING_QUICK.map((q) => (
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

      <button className="bfs-submit-btn" type="button" disabled={!orderId || !amount || submitting} onClick={handleSubmit}>
        {submitting ? <><span className="bfs-spinner" /> Processing…</> : 'Pay Now'}
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
